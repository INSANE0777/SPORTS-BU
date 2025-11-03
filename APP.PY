import openpyxl
import requests
import os
import re
from pathlib import Path
from urllib.parse import parse_qs, urlparse
import time

def extract_drive_links(excel_path, photo_column="photo", name_column="name"):
    """
    Extract all Drive links from the specified column in the Excel file.
    Also extracts names from the name column for file naming.
    Handles both plain URLs and hyperlinks.
    """
    wb = openpyxl.load_workbook(excel_path)
    ws = wb.active
    
    # Find the column indices
    header_row = 1
    photo_column_index = None
    name_column_index = None
    
    for cell in ws[header_row]:
        if cell.value:
            cell_value_lower = str(cell.value).strip().lower()
            if cell_value_lower == photo_column.lower():
                photo_column_index = cell.column
            elif cell_value_lower == name_column.lower():
                name_column_index = cell.column
    
    if photo_column_index is None:
        print(f"Error: Column '{photo_column}' not found in the Excel file")
        wb.close()
        return []
    
    if name_column_index is None:
        print(f"Warning: Column '{name_column}' not found. Files will be named automatically.")
    
    drive_links = []
    
    # Iterate through all rows (skip header)
    for row_num in range(header_row + 1, ws.max_row + 1):
        photo_cell = ws.cell(row=row_num, column=photo_column_index)
        
        if photo_cell is None:
            continue
        
        link = None
        
        # Check if cell has a hyperlink
        if photo_cell.hyperlink:
            link = photo_cell.hyperlink.target or photo_cell.hyperlink.location
        # Check if cell value is a URL
        elif photo_cell.value and isinstance(photo_cell.value, str):
            # Check if it looks like a URL
            if photo_cell.value.startswith(('http://', 'https://', 'www.')):
                link = photo_cell.value
            elif 'drive.google.com' in photo_cell.value:
                link = photo_cell.value
        
        if link:
            # Clean and normalize the link
            link = link.strip()
            if link and ('drive.google.com' in link or 'docs.google.com' in link):
                # Get name from name column if available
                name = None
                if name_column_index:
                    name_cell = ws.cell(row=row_num, column=name_column_index)
                    if name_cell and name_cell.value:
                        name = str(name_cell.value).strip()
                
                drive_links.append({
                    'link': link,
                    'row': row_num,
                    'cell_value': photo_cell.value,
                    'name': name
                })
    
    wb.close()
    return drive_links

def convert_drive_link_to_direct_download(link):
    """
    Convert Google Drive sharing links to direct download links.
    """
    # Pattern 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    file_id_pattern = r'/file/d/([a-zA-Z0-9_-]+)'
    match = re.search(file_id_pattern, link)
    
    if match:
        file_id = match.group(1)
        # Convert to direct download link
        direct_link = f"https://drive.google.com/uc?export=download&id={file_id}"
        return direct_link, file_id
    
    # Pattern 2: https://drive.google.com/open?id=FILE_ID
    if 'id=' in link:
        parsed = urlparse(link)
        params = parse_qs(parsed.query)
        if 'id' in params:
            file_id = params['id'][0]
            direct_link = f"https://drive.google.com/uc?export=download&id={file_id}"
            return direct_link, file_id
    
    # Pattern 3: Already a direct download link
    if 'uc?export=download' in link:
        parsed = urlparse(link)
        params = parse_qs(parsed.query)
        if 'id' in params:
            file_id = params['id'][0]
            return link, file_id
    
    return None, None

def download_file(url, file_path, max_retries=3):
    """
    Download a file from the given URL with retry logic.
    Handles large files that might require confirmation.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for attempt in range(max_retries):
        try:
            session = requests.Session()
            response = session.get(url, headers=headers, stream=True, timeout=30)
            
            # Handle Google Drive virus scan warning
            if 'virus scan warning' in response.text.lower() or len(response.content) < 1000:
                # Try to extract the actual download link from the warning page
                confirm_match = re.search(r'href="(/uc\?export=download[^"]+)', response.text)
                if confirm_match:
                    confirm_url = 'https://drive.google.com' + confirm_match.group(1).replace('&amp;', '&')
                    response = session.get(confirm_url, headers=headers, stream=True, timeout=30)
            
            if response.status_code == 200:
                total_size = int(response.headers.get('content-length', 0))
                downloaded = 0
                
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                
                with open(file_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
                            downloaded += len(chunk)
                            if total_size > 0:
                                percent = (downloaded / total_size) * 100
                                print(f"  Downloaded: {percent:.1f}%", end='\r')
                
                print(f"  ✓ Downloaded successfully: {file_path}")
                return True
            
            else:
                print(f"  ✗ Failed: HTTP {response.status_code}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
        
        except Exception as e:
            print(f"  ✗ Error: {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
    
    return False

def sanitize_filename(name):
    """
    Clean filename to remove invalid characters for filesystem.
    """
    if not name:
        return None
    
    # Remove or replace invalid characters
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        name = name.replace(char, '_')
    
    # Remove leading/trailing spaces and dots
    name = name.strip('. ')
    
    # Limit length
    if len(name) > 200:
        name = name[:200]
    
    return name

def get_filename_from_url(url, default="file"):
    """
    Try to get filename from URL or response headers.
    Returns just the filename (with extension if available).
    """
    parsed = urlparse(url)
    filename = os.path.basename(parsed.path)
    
    if not filename or filename == '/' or '.' not in filename:
        # Try to get from content-disposition header
        try:
            response = requests.head(url, allow_redirects=True, timeout=10)
            content_disp = response.headers.get('content-disposition', '')
            if content_disp:
                filename_match = re.search(r'filename="?([^"]+)"?', content_disp)
                if filename_match:
                    filename = filename_match.group(1)
        except:
            pass
    
    if not filename or filename == '/':
        filename = f"{default}.bin"
    
    return filename

def main():
    excel_file = "Auction Players.xlsx"
    output_dir = "downloaded_files"
    
    print(f"Reading Excel file: {excel_file}")
    print("=" * 60)
    
    # Extract all drive links
    drive_links = extract_drive_links(excel_file, "photo")
    
    if not drive_links:
        print("No Drive links found in the Excel file.")
        return
    
    print(f"Found {len(drive_links)} Drive link(s)")
    print("=" * 60)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Download each file
    successful = 0
    failed = 0
    
    for i, item in enumerate(drive_links, 1):
        link = item['link']
        row = item['row']
        
        print(f"\n[{i}/{len(drive_links)}] Row {row}: Processing link...")
        print(f"  Link: {link}")
        
        # Convert to direct download link
        direct_link, file_id = convert_drive_link_to_direct_download(link)
        
        if not direct_link:
            print(f"  ✗ Could not convert link to direct download format")
            failed += 1
            continue
        
        print(f"  Direct download: {direct_link}")
        
        # Get name from Excel if available
        name = item.get('name')
        
        # Try to get filename from URL to determine extension
        default_filename = get_filename_from_url(direct_link, f"file_{file_id}")
        _, ext = os.path.splitext(default_filename)
        
        # Use name from Excel if available, otherwise use default
        if name:
            sanitized_name = sanitize_filename(name)
            filename = f"{sanitized_name}{ext}" if ext else sanitized_name
        else:
            filename = default_filename
        
        # Create file path
        file_path = os.path.join(output_dir, filename)
        
        # If file already exists, add row number to avoid overwriting
        if os.path.exists(file_path):
            name_part, ext_part = os.path.splitext(filename)
            file_path = os.path.join(output_dir, f"{name_part}_row{row}{ext_part}")
        
        # Download the file
        if download_file(direct_link, file_path):
            successful += 1
        else:
            failed += 1
        
        # Small delay to avoid rate limiting
        time.sleep(1)
    
    print("\n" + "=" * 60)
    print(f"Download complete!")
    print(f"  Successful: {successful}")
    print(f"  Failed: {failed}")
    print(f"  Output directory: {output_dir}")

if __name__ == "__main__":
    main()

