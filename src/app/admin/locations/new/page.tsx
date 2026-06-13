import { LocationForm } from '@/components/admin/LocationForm'

export default function NewLocationPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold mb-6">Add New Location</h1>
      <LocationForm />
    </div>
  )
}
