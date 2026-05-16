export const contentWidthClassName = 'mx-auto w-full max-w-md px-5 pb-28 sm:px-8 lg:px-0'
export const profileWidthClassName = 'mx-auto w-full max-w-[700px] px-5 pb-32 sm:px-8 lg:px-0'
export const inputClassName =
  'h-14 w-full border border-[#C9C9C9] bg-white px-4 pr-12 text-base text-primary outline-none transition placeholder:text-[#8B8B8B] focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/15 disabled:opacity-60'
export const roundedInputClassName =
  'h-12 w-full rounded-md border-0 bg-white px-4 pr-11 text-base text-primary shadow-sm outline-none transition placeholder:text-[#8B8B8B] focus:ring-2 focus:ring-[#004080]/20 disabled:opacity-60'

export const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    return typeof message === 'string' ? message : undefined
  }

  return undefined
}
