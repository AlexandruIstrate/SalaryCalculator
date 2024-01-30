function NewTabLink({ href, title }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
        >
            {title}
        </a>
    )
}

export default NewTabLink;