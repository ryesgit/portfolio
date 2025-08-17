import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useContext } from 'react';
import DarkModeContext from '../../../contexts/DarkModeProvider';

const ProjectsSkeleton = () => {
    const { dark } = useContext(DarkModeContext);

    return (
        <SkeletonTheme 
            baseColor={dark ? "#1a1a1a" : "#ebebeb"} 
            highlightColor={dark ? "#2a2a2a" : "#f5f5f5"}
        >
            <section style={{ width: '100%', maxWidth: '1200px', padding: '2rem' }}>
                <Skeleton height={40} width={200} style={{ marginBottom: '2rem' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i}>
                            <Skeleton height={200} style={{ marginBottom: '1rem' }} />
                            <Skeleton height={30} width="80%" style={{ marginBottom: '0.5rem' }} />
                            <Skeleton height={20} width="60%" />
                        </div>
                    ))}
                </div>
            </section>
        </SkeletonTheme>
    );
};

export default ProjectsSkeleton;