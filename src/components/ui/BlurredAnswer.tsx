import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import styles from './BlurredAnswer.module.css';
import { ChevronDown } from "lucide-react"

interface BlurredAnswerProps {
    children: React.ReactNode;
}

const BlurredAnswer: React.FC<BlurredAnswerProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.container}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.button}
                variant="outline"
            >
                <ChevronDown className={`${styles.icon} ${isOpen ? styles.open : ''}`} />
                {isOpen ? '收起答案' : '显示答案'}
            </Button>
            {isOpen && (
                <div className={styles.content}>
                    {children}
                </div>
            )}
        </div>
    );
};

export default BlurredAnswer;