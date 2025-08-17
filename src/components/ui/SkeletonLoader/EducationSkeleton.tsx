import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useContext } from 'react';
import DarkModeContext from '../../../contexts/DarkModeProvider';

const EducationSkeleton = () => {
    const { dark } = useContext(DarkModeContext);

    return (
        <SkeletonTheme 
            baseColor={dark ? "#1a1a1a" : "#ebebeb"} 
            highlightColor={dark ? "#2a2a2a" : "#f5f5f5"}
        >
            <section style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
                <Skeleton height={40} width={200} style={{ marginBottom: '2rem' }} />
                {[1, 2].map((i) => (
                    <div key={i} style={{ marginBottom: '2rem' }}>
                        <Skeleton height={30} width="60%" style={{ marginBottom: '0.5rem' }} />
                        <Skeleton height={20} width="40%" style={{ marginBottom: '0.5rem' }} />
                        <Skeleton height={20} width="50%" />
                    </div>
                ))}
            </section>
        </SkeletonTheme>
    );
};

export default EducationSkeleton;