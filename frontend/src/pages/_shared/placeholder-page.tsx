interface PlaceholderPageProps {
  title: string
  description: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section
      aria-labelledby='placeholder-page-title'
      className='mx-auto flex min-h-[320px] w-full max-w-4xl flex-col justify-center gap-3 px-4 py-10'
    >
      <h1 id='placeholder-page-title' className='text-3xl font-semibold text-gray-900 dark:text-gray-50'>
        {title}
      </h1>
      <p className='max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300'>{description}</p>
    </section>
  )
}
