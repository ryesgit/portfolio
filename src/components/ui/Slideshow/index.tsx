import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Slideshow.css";

const Slideshow = ({ images }: { images: string[] }) => {
    const slides = images;
    const [active, setActive] = useState(1);

    const next = () => setActive(active + 1);
  
    useEffect(() => {
        const timer = setTimeout(() => {
            next();
        }, 3000);

        return () => { clearInterval(timer) }
    }, [active, next]);
    
    return (
        <div>
            <AnimatePresence>
                {
                    slides.map((slide, index) => {
                    return <Slide key={index} slide={slide} isActive={slides.indexOf(slide) === (active % slides.length)} />;
                    })
                }
            </AnimatePresence>
        </div>
    )
}

const Slide = ({ slide, isActive }: { slide: string, isActive: boolean }) => {
    if(isActive) {
        return (
            <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            >
                <img src={slide} />
            </motion.div>
        );
    }

    return null;
};

export default Slideshow;