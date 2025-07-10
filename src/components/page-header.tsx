interface PageHeaderProps {
    title: string;
    description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <section className="py-20 md:py-28 relative bg-muted/25">
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-full w-full"
                style={{
                background: 'radial-gradient(circle at top, hsla(var(--primary) / 0.05), transparent 60%)'
                }}
            />
            <div className="container max-w-4xl px-4 text-center">
                <h1 className="text-4xl font-bold md:text-5xl tracking-tight">{title}</h1>
                <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            </div>
        </section>
    )
}
