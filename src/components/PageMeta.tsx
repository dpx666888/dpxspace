interface PageMetaProps {
  title: string
  description?: string
}

export default function PageMeta({ title, description }: PageMetaProps) {
  return (
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
    </>
  )
}
