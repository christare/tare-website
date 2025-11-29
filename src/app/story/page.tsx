// Temporarily hide the Story page by returning a 404 for /story
import { notFound } from 'next/navigation';

export default function StoryPage() {
  notFound();
}

