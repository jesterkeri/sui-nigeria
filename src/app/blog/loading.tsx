export default function BlogLoading() {
    return (
        <main className="blog-page">
            <div className="blog-loading">
                <div className="blog-loading-hero blog-skeleton" />

                <div className="blog-loading-content">
                    <div className="blog-loading-featured">
                        <div className="blog-loading-featured-text">
                            <div className="blog-skeleton blog-skeleton-tag" />
                            <div className="blog-skeleton blog-skeleton-line" style={{ width: '40%' }} />
                            <div className="blog-skeleton blog-skeleton-title" />
                            <div className="blog-skeleton blog-skeleton-line" />
                            <div className="blog-skeleton blog-skeleton-line" style={{ width: '75%' }} />
                        </div>
                        <div className="blog-skeleton blog-loading-featured-img" />
                    </div>

                    <div className="blog-loading-header">
                        <div className="blog-skeleton blog-skeleton-title" style={{ width: '180px' }} />
                        <div className="blog-skeleton blog-skeleton-tag" style={{ width: '120px' }} />
                    </div>

                    <div className="blog-loading-grid">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="blog-loading-card">
                                <div className="blog-skeleton blog-loading-card-img" />
                                <div className="blog-loading-card-body">
                                    <div className="blog-loading-card-tags">
                                        <div className="blog-skeleton blog-skeleton-tag" />
                                        <div className="blog-skeleton blog-skeleton-tag" />
                                    </div>
                                    <div className="blog-skeleton blog-skeleton-line" style={{ width: '50%' }} />
                                    <div className="blog-skeleton blog-skeleton-title" />
                                    <div className="blog-skeleton blog-skeleton-line" />
                                    <div className="blog-skeleton blog-skeleton-line" style={{ width: '60%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
