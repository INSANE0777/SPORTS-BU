import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { useLenis } from "@/hooks/useLenis";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GenerativeArtScene } from "@/components/GenerativeArtScene"; // Import the scene

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  useLenis();
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-element", { opacity: 0, y: 50, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.5 });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    // Set the main background to 'paper' and make it a positioning anchor
    <div ref={mainRef} className="relative min-h-screen bg-paper text-foreground overflow-x-hidden">
      
      {/* Place the particle system as the background */}
      <GenerativeArtScene />

      {/* Place all visible content on top of the particle system */}
      <div className="relative z-10">
        <main>
          <section className="relative min-h-screen flex items-center pt-20 pb-20 px-6 overflow-hidden">
            {/* The abstract shape is no longer needed as the particle system provides the visual interest */}
            <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div className="z-10">
                <h1 className="hero-element text-6xl md:text-8xl font-black text-foreground mb-6 leading-tight">
                  The Arena of
                  <span className="block text-gradient-primary">Digital Sport</span>
                </h1>
                <p className="hero-element text-xl md:text-2L text-muted-foreground mb-10 max-w-lg">
                  Where strategy meets spectacle. Witness elite houses clash in a real-time battle for the ultimate athletic talent.
                </p>
                <div className="hero-element flex flex-col sm:flex-row gap-4">
                  <Link to="/login">
                    <Button size="lg" className="w-full sm:w-auto group relative gradient-primary text-lg px-8 py-6 text-primary-foreground transition-shadow duration-300 hover:shadow-strong">
                      Launch as Admin
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 hover:bg-foreground hover:text-background transition-colors duration-300">
                      Enter as House
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative hidden lg:flex items-center justify-center h-[500px]">
                <div className="hero-element absolute w-52 h-52 top-0 left-10 bg-ink rounded-3xl p-6 flex items-center justify-center shadow-soft">
                  <img src="/BENNETT.png" alt="Bennett University Logo" className="w-full h-full object-contain" />
                </div>
                <div className="hero-element absolute w-72 h-72 bottom-0 right-10 bg-ink rounded-3xl p-8 flex items-center justify-center shadow-soft">
                  <img src="/SPORTS.png" alt="Sports Committee Logo" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </section>
        </main>

       
      </div>
    </div>
  );
};

export default Landing;