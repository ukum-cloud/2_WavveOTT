import React from 'react';
import type { CSSProperties } from 'react';

const LoadingBar: React.FC = () => {
    return (
        <div style={containerStyle}>
            <div style={contentWrapperStyle}>
                <div style={loaderContainerStyle}>
                    <div style={loaderProgressStyle}></div>
                </div>
                <p style={textStyle}>데이터를 불러오는 중입니다...</p>
            </div>

            <style>
                {`
                    @keyframes loading-wave {
                        0% { left: -45%; width: 45%; }
                        50% { left: 25%; width: 50%; opacity: 0.8; }
                        100% { left: 100%; width: 45%; }
                    }

                    @keyframes pulse-opacity {
                        0%, 100% { opacity: 0.4; }
                        50% { opacity: 1; }
                    }
                `}
            </style>
        </div>
    );
};

const containerStyle: CSSProperties = {
    backgroundColor: '#000',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontFamily: 'inherit',
};

const contentWrapperStyle: CSSProperties = {
    textAlign: 'center',
    width: '300px',
};

const loaderContainerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '3px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
};

const loaderProgressStyle: CSSProperties = {
    position: 'absolute',
    height: '100%',
    width: '45%',
    background: 'linear-gradient(90deg, transparent, #00d0ff, #0078ff, transparent)',
    borderRadius: '10px',
    animation: 'loading-wave 1.6s infinite ease-in-out',
};

const textStyle: CSSProperties = {
    fontSize: '15px',
    fontWeight: '400',
    color: '#efefef',
    letterSpacing: '-0.02em',
    animation: 'pulse-opacity 1.8s infinite ease-in-out',
};

export default LoadingBar;