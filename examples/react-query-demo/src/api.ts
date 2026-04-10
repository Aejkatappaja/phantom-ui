export interface User {
	id: number;
	name: string;
	role: string;
	avatar: string;
	bio: string;
}

export interface Post {
	id: number;
	title: string;
	excerpt: string;
	date: string;
	author: string;
}

const users: User[] = [
	{ id: 1, name: "Sarah Chen", role: "Staff Engineer", avatar: "https://i.pravatar.cc/80?img=1", bio: "Building distributed systems at scale. Previously at Stripe and Vercel." },
	{ id: 2, name: "Marcus Johnson", role: "Design Lead", avatar: "https://i.pravatar.cc/80?img=3", bio: "Crafting design systems and component libraries. Figma enthusiast." },
	{ id: 3, name: "Elena Rodriguez", role: "Senior SRE", avatar: "https://i.pravatar.cc/80?img=5", bio: "Keeping production alive. Kubernetes, Terraform, and too much coffee." },
];

const posts: Post[] = [
	{ id: 1, title: "Migrating to React Server Components", excerpt: "Our journey moving a large Next.js app to the App Router with RSC.", date: "Apr 8, 2026", author: "Sarah Chen" },
	{ id: 2, title: "Design Tokens at Scale", excerpt: "How we built a token pipeline that syncs Figma variables to code.", date: "Apr 6, 2026", author: "Marcus Johnson" },
	{ id: 3, title: "Zero-Downtime Deployments", excerpt: "Blue-green deployments with Kubernetes and Argo Rollouts.", date: "Apr 3, 2026", author: "Elena Rodriguez" },
	{ id: 4, title: "TypeScript Patterns We Use Daily", excerpt: "Discriminated unions, branded types, and the satisfies operator.", date: "Mar 30, 2026", author: "Sarah Chen" },
];

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchUsers(): Promise<User[]> {
	await delay(2000);
	return users;
}

export async function fetchUser(id: number): Promise<User> {
	await delay(1800);
	const user = users.find((u) => u.id === id);
	if (!user) throw new Error("User not found");
	return user;
}

export async function fetchPosts(): Promise<Post[]> {
	await delay(2500);
	return posts;
}
