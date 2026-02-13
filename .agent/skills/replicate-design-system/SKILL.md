---
name: replicate-design-system
description: Replicate the Hotels module design system in other modules (tables, modals, forms, stats).
---

# Design System Replication Skill

Use this skill when the user asks to refactor a module to match the Hotels module design system.

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
       {/* Actions */}
       <Button variant="outline" ...><Download /> Exportar</Button>
       <Button variant="primary" ...><Plus /> Crear [Entity]</Button>
    </div>
  </div>

  {/* Stats Cards Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {/* See Stats Section below */}
  </div>

  {/* Table */}
  <[Module]Table ... />

  {/* Modals */}
  <Create[Module]Modal ... />
  <Edit[Module]Modal ... />
  <[Module]DetailModal ... />
</div>
```

## 2. Stats Cards

Use this structure and classes for KPI cards:

- **Container**: `bg-[color]-50 rounded-xl p-6 border border-gray-100`
- **Layout**: `flex items-center justify-between`
- **Label**: `text-sm text-gray-500`
- **Value**: `text-3xl font-bold text-[color]-600`
- **Icon**: `h-8 w-8 text-[color]-500`

**Recommended Colors**:

- Total: `blue`
- Active/Verified: `green`
- Pending/Warning: `orange`
- Other: `purple`, `indigo`

## 3. Data Table (`[Module]Table.tsx`)

### Search & Filters

- **Container**: `bg-white p-4 rounded-xl border border-secondary-200 shadow-soft-sm` (flex for responsive).
- **Search Input**: Use `Input` component with `leftIcon={<Search className="h-4 w-4" />}`.
- **Clear Button**: Inside input (`rightIcon`), visible only if text exists.

### Table Structure

- Components: `Table`, `TableHeader`, `TableRow`, `TableHead`, `TableBody`, `TableCell` from `../ui/Table`.
- **Header**: Simple text. Numeric columns or actions right-aligned (`text-right`).
- **Empty State**: `TableCell` with `colSpan` total, fixed height (`h-64`), large icon (`h-12 w-12 opacity-20`), help text, and clear filters button.

### Cells & Styling

- **Primary Identifier**:
  - Avatar/Initial: `h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 font-bold border border-primary-200`.
  - Main Text: `font-medium text-secondary-900`.
  - Subtext (Email, Tel): `text-xs text-secondary-500` with small icons (`h-3 w-3`).
- **Badges**:
  - Use `Badge` component (`../ui/Badge`).
  - Variants: `success` (Verified, Active), `error` (Inactive, Not Verified), `secondary` (Boolean false), `warning`.
  - Style: `rounded-full` for status, `rounded-md` for tags/categories.
- **Actions**:
  - Use `Button` with `variant="ghost" size="sm"`.
  - **View**: `text-blue-600 hover:text-blue-700 hover:bg-blue-50`
  - **Edit**: `text-amber-600 hover:text-amber-700 hover:bg-amber-50`
  - **Delete**: `text-red-600 hover:text-red-700 hover:bg-red-50`

### Pagination

- Same style as `HotelTable`.
- Buttons "Previous"/"Next" as `outline`.
- Page numbers: Active `bg-primary-600 text-white`, Inactive `text-secondary-600 hover:bg-secondary-100`.

## 4. Modals & Forms (`Create/Edit[Module]Modal.tsx`)

### Modal Wrapper

- Use `Modal` component (`../ui/Modal`).
- Size: Usually `3xl` for complex forms, `2xl` or `lg` for simple ones.

### Form Layout

- **Vertical Spacing**: `className="space-y-8"` on `form`.
- **Sections**:
  - Title: `flex items-center gap-2 pb-2 border-b border-secondary-100`.
  - Icon: `p-1.5 bg-primary-100 text-primary-700 rounded-lg`.
  - Input Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`.

### Inputs & Controls

- Always use `Input`, `Select`, `Textarea` from `../ui/*`.
- **Labels**: Clear, with asterisk `*` if required.
- **Checkbox Groups**:
  - Container: `grid grid-cols-2 ... gap-3`.
  - Item Style: `flex items-center gap-2 ... p-2 hover:bg-secondary-50 rounded-lg border border-transparent hover:border-secondary-100`.

### Footer (Actions)

- Container: `flex justify-end gap-3 pt-6 border-t border-secondary-100`.
- **Cancel**: `Button` variant `outline`.
- **Save**: `Button` variant `primary`, with `Save` icon and `isLoading` state.

## 5. Alerts (`SweetAlert2`)

Use `Swal.fire` with `customClass` to match Tailwind:

```javascript
customClass: {
  popup: 'rounded-xl shadow-2xl',
  title: 'text-xl font-bold text-gray-900',
  confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
  cancelButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
}
```

- **Delete Confirmation**: Large warning icon, `confirmButtonColor: '#dc2626'`.
- **Success**: Success icon, `confirmButtonColor: '#10b981'`, `timer: 2000`.

## 6. Common Resources

- Icons: Use `lucide-react`.
- Utilities: Use `cn` from `../../lib/utils`.
- Types: Ensure TS interfaces are defined in `src/types/`.
