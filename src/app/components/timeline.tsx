"use client"

import React, { useEffect, useState } from 'react'

interface TimelineProps {
    dateID: number,
    title: string,
    location: string,
    date: string
}

export default function Timeline() {
    const [timelineItems, setTimelineItems] = useState<TimelineProps[]>([])
    const [mouseX, setMouseX] = useState<number | null>(null);
    const [hrElement, setHrElement] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const hrElement = document.getElementById('timeline-hr');
        setHrElement(hrElement);
    }, []);

    const width = '1000px'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/usDates.json');
                const data = await res.json();

                const sortedItems = data.dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                setTimelineItems(data.dates)
            } catch (error) {
                console.log('Error fetching data:', error)
            }
        }

        fetchData();
    }, [])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        console.log(e.clientX)
        setMouseX(e.clientX)
    }

    const calculateDotStyle = (index: number) => {
        if (!hrElement) return {}; // Make sure hrElement is defined
    
        const hrRect = hrElement.getBoundingClientRect();
        const hrStartX = hrRect.left;
        const hrEndX = hrRect.right;

        console.log(hrStartX, hrEndX)
    
        const distance = mouseX !== null ? Math.abs(mouseX - (index * 30)) : 0;
        const maxDistance = 300; // Adjust based on preference, this is the maximum distance for the largest dot
        const scale = 1 + (maxDistance - distance) / maxDistance; // Larger dots for closer distances
        const margin = distance / 2000; // Adjust based on preference
    
        return { scale, margin, hrStartX, hrEndX };
    }

    return (
        <div>
            <div className='bg-gray-200 m-6 h-[400px] flex justify-center' onMouseMove={handleMouseMove}>
                <hr id="timeline-hr" className={`border-black border-4 absolute self-center w-[${width}]`} />
                <div className='flex flex-row h-[100px] self-center place-items-center z-10'>
                    {timelineItems.map((item, index) => (
                        <MemoryDot key={item.dateID} item={item} index={index} calculateDotStyle={calculateDotStyle}/>
                    ))}
                </div>
            </div>
            <div>
            </div>
        </div>
      );
}

function MemoryDot({ item, index, calculateDotStyle }: { item: TimelineProps; index: number; calculateDotStyle: (index: number) => any }) {
    const [showPopUp, setShowPopup] = useState(false)

    const handleDotHover = () => {
        setShowPopup(!showPopUp);

    }

    const itemDate = new Date(item.date).toLocaleString()
    const dotStyle = calculateDotStyle(index);

    return (
        <div
            className={`memory-dot ${showPopUp ? 'bg-black' : 'bg-green-500'} w-3 h-3 rounded-full m-0.5`}
            onMouseEnter={handleDotHover}
            onMouseLeave={handleDotHover}
            style={{
                transform: `scale(${dotStyle.scale})`,
                marginLeft: `${dotStyle.margin}px`,
            }}
        >
        </div>
      );
    }