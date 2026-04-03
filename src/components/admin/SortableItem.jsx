import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, children, disabled = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative',
  };

  const handleStyle = {
    cursor: disabled ? 'default' : 'grab',
    touchAction: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    background: 'rgba(0,0,0,0.03)',
    color: 'var(--color-muted)',
    transition: 'all 0.2s ease',
  };

  // Re-injecting the listeners into a specific "handle" if we want, 
  // but for simplicity here we'll provide the listeners as an object 
  // that can be spread onto a handle element.
  
  return (
    <div ref={setNodeRef} style={style}>
      {/* 
        This is a render-prop style approach where we pass the 
        drag handle properties to the children. 
      */}
      {typeof children === 'function' ? children({ attributes, listeners, handleStyle, isDragging }) : children}
    </div>
  );
}

// A simple Icon for the drag handle
export const DragHandleIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 2.5C4 2.77614 3.77614 3 3.5 3C3.22386 3 3 2.77614 3 2.5C3 2.22386 3.22386 2 3.5 2C3.77614 2 4 2.22386 4 2.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M4 6.5C4 6.77614 3.77614 7 3.5 7C3.22386 7 3 6.77614 3 6.5C3 6.22386 3.22386 6 3.5 6C3.77614 6 4 6.22386 4 6.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M4 10.5C4 10.77614 3.77614 11 3.5 11C3.22386 11 3 10.77614 3 10.5C3 10.2239 3.22386 10 3.5 10C3.77614 10 4 10.2239 4 10.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M9 2.5C9 2.77614 8.77614 3 8.5 3C8.22386 3 8 2.77614 8 2.5C8 2.22386 8.22386 2 8.5 2C8.77614 2 9 2.22386 9 2.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M9 6.5C9 6.77614 8.77614 7 8.5 7C8.22386 7 8 6.77614 8 6.5C8 6.22386 8.22386 6 8.5 6C8.77614 6 9 6.22386 9 6.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    <path d="M9 10.5C9 10.77614 8.77614 11 8.5 11C8.22386 11 8 10.77614 8 10.5C8 10.2239 8.22386 10 8.5 10C8.77614 10 9 10.2239 9 10.5Z" fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
  </svg>
);
