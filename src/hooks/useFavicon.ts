const useFavicon = (iconUrl: string) => {
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (favicon) {
        favicon.href = iconUrl;
    }
};

export default useFavicon;
