import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import "./Slideshow.css";

const Slideshow = ({ images }: { images: string[] }) => {
    const slides = images;
    const [active, setActive] = useState(1);

    const next = () => setActive(active < slides.length ? active + 1 : 1);
  
    useEffect(() => {
        setTimeout(() => {
            next();
        }, 3000);
    }, [active, next]);
    
    return (
        <div>
            <AnimatePresence>
                {slides.map((slide) => {
                return <Slide slide={slide} isActive={slides.indexOf(slide) === active % slides.length} />;
                })}
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