import { ProjectForm } from '@/components/admin/project-form';

export default function NewProjectPage() {
	return (
		<div className='mx-auto max-w-3xl'>
			<h1 className='mb-8 font-display text-2xl uppercase'>New project</h1>
			<ProjectForm project={null} />
		</div>
	);
}
