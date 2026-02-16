---
name: replicate-design-system
description: Replicate the Hotels/Services module design system in other modules (tables, modals, forms, stats).
---

# Design System Replication Skill

Use this skill when the user asks to refactor a module to match the Hotels/Services module design system.

## 1. General Section Structure (`[Module]Section.tsx`)

Layout pattern:

```tsx
<div className="space-y-8">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <div className="flex items-center space-x-3">
        <Icon className="h-8 w-8 text-blue-600" /> {/* Feature Icon */}
        <h1 className="text-3xl font-bold text-gray-900">Gestión de [Entity]</h1>
      </div>
      <p className="text-gray-600 mt-2">Administra [brief description]</p>
    </div>
    <div className="flex items-center gap-3">
       {/* Actions Grouped on Right */}
       <Button variant="outline" ...><Download /> Exportar</Button>
       <Button variant="primary" ...><Plus /> Crear [Entity]</Button>
    </div>
  </div>

  {/* Stats Cards Grid */}
  <[Module]Stats ... />

  {/* Table Section */}
  <[Module]Table ... />

  {/* Visual Charts */}
  <[Module]Charts ... />

  {/* Modals */}
  <Create[Module]Modal ... />
  <Edit[Module]Modal ... />
  <[Module]DetailModal ... />
</div>
```

## 2. Stats Cards (`[Module]Stats.tsx`)

Use this structure for the 4-card KPI grid:

- **Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **Card Styling**: `rounded-xl p-6 border border-gray-100` with colored backgrounds.
- **Inner Layout**: `flex items-center justify-between`

**Color Patterns**:

1.  **Total Count**: `bg-blue-50`, Text `text-blue-600`, Icon `text-blue-500` (Icon: Package/Compass).
2.  **Active/Verified**: `bg-green-50`, Text `text-green-600`, Icon `text-green-500` (Icon: CheckCircle).
3.  **Categories/Types**: `bg-purple-50`, Text `text-purple-600`, Icon `text-purple-500` (Icon: Tag/Award).
4.  **Locations/Providers**: `bg-orange-50`, Text `text-orange-600`, Icon `text-orange-500` (Icon: MapPin/Globe).

## 3. Data Table (`[Module]Table.tsx`)

### Search & Filters Container

**CRITICAL**: Separate the search bar from the table itself into a distinct white card.

```tsx
<div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
  <div className="relative w-full md:w-96">
    <Input
      placeholder="Buscar..."
      leftIcon={<Search className="h-4 w-4" />}
      rightIcon={searchTerm ? <X ... /> : null}
    />
  </div>
  <div className="flex items-center gap-3">
    {/* Page Size Selector / Filters */}
  </div>
</div>
```

### Table Structure

- **Table Component**: `Table` from `../ui/Table`.
- **Badges**: Use `Badge` component. `rounded-full` for status (Active/Inactive), `rounded-md` for categories.
- **Empty State**:
  - `TableCell` with `colSpan={total_columns}`.
  - Height `h-64`, centered flex column.
  - Icon: Large (`h-12 w-12`), low opacity (`opacity-20`, `text-gray-400`).
  - Text: "No se encontraron resultados".
  - Action: "Limpiar búsqueda" button if search is active.

### Actions Column

Use `Button` with `variant="ghost" size="sm"` and specific colors:

- **View**: `text-blue-600 hover:text-blue-700 hover:bg-blue-50` (Icon: `Eye`)
- **Edit**: `text-amber-600 hover:text-amber-700 hover:bg-amber-50` (Icon: `Edit`)
- **Delete**: `text-red-600 hover:text-red-700 hover:bg-red-50` (Icon: `Trash2`)

## 4. Modals & Forms (`Create/Edit[Module]Modal.tsx`)

### Layout Strategy

- **Grid Layout**: Split complex forms into two columns: `grid grid-cols-1 md:grid-cols-2 gap-8`.
- **Section Headers**: Use visual headers to separate logical groups (e.g., Profile vs. Details).

**Section Header Pattern**:

```tsx
<div className="flex items-center gap-2 pb-2 border-b border-gray-100">
  <div className="p-1.5 bg-[color]-100 text-[color]-700 rounded-lg">
    <Icon className="h-5 w-5" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900">Title</h3>
</div>
```

_Colors: Blue for Profile/General, Green/Amber for Details/Settings, Rose for Location._

### Inputs

- Always use `Input`, `Select`, `Textarea` from `../ui/*`.
- Use `leftIcon` props for inputs to add visual cues (e.g., `Mail` for email, `Phone` for telephone).
- **Validation**: Show validation errors with `border-red-500` and error messages.

## 5. Charts (`[Module]Charts.tsx`)

- **Card Styling**: `border-none shadow-soft-xl` (Clean, elevated look).
- **Icons**: Use colored backgrounds for chart title icons (e.g., `bg-blue-50 text-blue-600`).
- **Loading State**: Include skeleton loaders matching the chart shape.
- **Empty State**: Centered text/icon when no data is available.

## 6. Alerts (`SweetAlert2`)

Match the Tailwind styling exactly:

```javascript
customClass: {
  popup: 'rounded-xl shadow-2xl',
  title: 'text-xl font-bold text-gray-900',
  confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
  cancelButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
}
```
