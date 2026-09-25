'use client';

import { useState } from 'react';

type CommaListInputProps = {
	value: string[];
	onChange: (items: string[]) => void;
	id?: string;
	placeholder?: string;
	className?: string;
};

function parse(raw: string): string[] {
	return raw
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

/**
 * A free-typed comma-separated list (tech tags, stack items, ...).
 * Deriving the input's value from the parsed array on every keystroke — the
 * previous approach — strips a trailing ", " the instant it's typed (nothing
 * comes after it yet), which snaps the displayed text back and makes it
 * impossible to type past a comma. So this keeps its own raw text while
 * focused and only re-derives it from the (already-committed) array on blur.
 */
export function CommaListInput({
	value,
	onChange,
	id,
	placeholder,
	className,
}: CommaListInputProps) {
	const [text, setText] = useState(() => value.join(', '));

	return (
		<input
			id={id}
			value={text}
			placeholder={placeholder}
			onChange={(e) => {
				setText(e.target.value);
				onChange(parse(e.target.value));
			}}
			onBlur={() => setText(value.join(', '))}
			className={className}
		/>
	);
}
