import Image from 'next/image';
import myQRCode from 'public/qrcode.png';
import payQRCode from "public/code.avif";
import styles from './FollowMe.module.css';

export default function FollowMe() {
    return <>
        <div className={styles.container}>
            <div className={`${styles.column} ${styles.columnLeft}`}>
                <Image
                    src={myQRCode}
                    className={styles.image}
                    alt="上岸学堂"
                    width={200}
                    height={200}
                />
                <p className={styles.text}>微信扫码获取DeepSeek专属公考私教和10000+优质考公资料</p>
            </div>
            {/* <div className={`${styles.column} ${styles.columnRight}`}>
                <Image
                    src={payQRCode}
                    className={styles.image}
                    alt="打赏二维码"
                    width={200}
                    height={200}
                />
                <p className={styles.text}>免费不易，且行且珍惜<br />打赏支持一下吧！</p>
            </div> */}
        </div>
    </>
}