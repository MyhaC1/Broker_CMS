import { redirect } from 'next/navigation'

/** У CMS нет собственного фронта — корень ведёт в админку. */
export default function HomePage() {
  redirect('/admin')
}
