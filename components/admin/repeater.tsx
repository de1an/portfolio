'use client';

type RepeaterProps<T> = {
	items: T[];
	onChange: (items: T[]) => void;
	renderItem: (
		item: T,
		index: number,
		update: (item: T) => void,
	) => React.ReactNode;
	newItem: () => T;
	addLabel: string;
	/** Caps how many items can be added — e.g. the 5-image gallery limit. */
	max?: number;
	/** DOM id for the item's wrapper — lets a validation error scroll straight to item #index. */
	itemId?: (index: number) => string;
	/** Whether item #index (or anything nested inside it) currently has a validation error. */
	itemHasError?: (index: number) => boolean;
};

/** Generic add/remove/reorder list editor shared by every repeatable case-study block. */
export function Repeater<T>({
	items,
	onChange,
	renderItem,
	newItem,
	addLabel,
	max,
	itemId,
	itemHasError,
}: RepeaterProps<T>) {
	function update(index: number, item: T) {
		const next = [...items];
		next[index] = item;
		onChange(next);
	}

	function remove(index: number) {
		onChange(items.filter((_, i) => i !== index));
	}

	function move(index: number, dir: -1 | 1) {
		const target = index + dir;
		if (target < 0 || target >= items.length) return;
		const next = [...items];
		[next[index], next[target]] = [next[target], next[index]];
		onChange(next);
	}

	const atMax = typeof max === 'number' && items.length >= max;

	return (
		<div className='space-y-3'>
			{items.map((item, i) => (
				<div
					key={i}
					id={itemId?.(i)}
					className={`rounded-xl border p-3 ${
						itemHasError?.(i)
							? 'border-red-400/70 ring-1 ring-red-400/40'
							: 'border-ink/15'
					}`}
				>
					<div className='mb-2 flex items-center justify-between'>
						<span className='font-mono text-xs uppercase tracking-wide text-faint'>
							#{i + 1}
						</span>
						<div className='flex items-center gap-3 text-xs'>
							<button
								type='button'
								onClick={() => move(i, -1)}
								disabled={i === 0}
								className='text-muted hover:text-ink disabled:opacity-30'
								aria-label='Move up'
							>
								↑
							</button>
							<button
								type='button'
								onClick={() => move(i, 1)}
								disabled={i === items.length - 1}
								className='text-muted hover:text-ink disabled:opacity-30'
								aria-label='Move down'
							>
								↓
							</button>
							<button
								type='button'
								onClick={() => remove(i)}
								className='text-red-400 hover:text-red-300'
							>
								Remove
							</button>
						</div>
					</div>
					{renderItem(item, i, (updated) => update(i, updated))}
				</div>
			))}
			{!atMax && (
				<button
					type='button'
					onClick={() => onChange([...items, newItem()])}
					className='rounded-lg border border-dashed border-ink/25 px-3 py-2 text-xs uppercase tracking-wide text-muted transition-colors hover:border-ink/50 hover:text-ink'
				>
					+ {addLabel}
				</button>
			)}
		</div>
	);
}
