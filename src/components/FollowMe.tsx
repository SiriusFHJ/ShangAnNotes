import React from 'react';
import styles from './FollowMe.module.css';

const FollowMe = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <img
                    src="/miniprogram.webp"
                    alt="上岸学堂小程序二维码"
                    className={styles.qrImage}
                />
                <div className={styles.textContainer}>
                    <h4 className={styles.title}>
                        🎯 扫码体验小程序
                    </h4>
                    <p className={styles.description}>
                        AI刷题 自由打印
                    </p>
                </div>
            </div>
            <div className={styles.card}>
                <img
                    src="/server.webp"
                    alt="上岸小助手二维码"
                    className={styles.qrImage}
                />
                <div className={styles.textContainer}>
                    <h4 className={styles.title}>
                        🤖 上岸小助手
                    </h4>
                    <p className={styles.description}>
                        • 24小时在线答疑<br />
                        • 个性化学习指导<br />
                        • 最新考试资讯
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FollowMe; 