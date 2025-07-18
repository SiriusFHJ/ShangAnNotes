
import Image from 'next/image';
import React from 'react';

const WeChatScan: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            margin: '20px auto',
            textAlign: 'center'
        }}>
            <h2 style={{ color: '#333', marginBottom: '15px' }}>
                由于平台限制，请
                <span style={{ color: 'red' }}>微信扫码</span>或者<span style={{ color: 'purple' }}>长按识别二维码</span>阅读完整文章
            </h2>
            <div style={{ marginBottom: '20px' }}>
                <Image
                    src="/knowledge.webp"
                    alt="知识手册"
                    width={300}
                    height={300}
                    objectFit="contain"
                />
            </div>
        </div>
    );
};

export default WeChatScan; 