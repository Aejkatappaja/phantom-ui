import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import "@aejkatappaja/phantom-ui";
import { fetchUser, fetchPosts } from "./api";
import type { Post } from "./api";

const queryClient = new QueryClient();

function UserProfile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", 1],
    queryFn: () => fetchUser(1),
  });

  return (
    <phantom-ui loading={isLoading} animation="shimmer" reveal={0.3}>
      <div className="profile-card">
        <img
          src={user?.avatar ?? ""}
          width="64"
          height="64"
          className="avatar"
          alt=""
        />
        <div className="profile-info">
          <h2>{user?.name ?? "Placeholder Name"}</h2>
          <span className="role">{user?.role ?? "Role Title"}</span>
          <p className="bio">
            {user?.bio ?? "A short bio description goes here for measurement."}
          </p>
        </div>
      </div>
    </phantom-ui>
  );
}

function PostCard({ post }: { post?: Post }) {
  return (
    <div className="post-card">
      <span className="post-date">{post?.date ?? "Jan 1, 2026"}</span>
      <h3>{post?.title ?? "Post Title Placeholder"}</h3>
      <p>
        {post?.excerpt ??
          "A short excerpt that gives the skeleton some height to measure."}
      </p>
      <span className="post-author">{post?.author ?? "Author Name"}</span>
    </div>
  );
}

function PostList() {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <div>
      <h2 className="section-title">Latest Posts</h2>
      <div className="post-list">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <phantom-ui key={i} loading animation="shimmer">
                <PostCard />
              </phantom-ui>
            ))
          : posts?.map((post) => (
              <phantom-ui key={post.id}>
                <PostCard post={post} />
              </phantom-ui>
            ))}
      </div>
    </div>
  );
}

function UserList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchPosts(),
  });

  return (
    <div>
      <h2 className="section-title">Team (count mode)</h2>
      <phantom-ui loading={isLoading} count={4} count-gap={10} animation="shimmer">
        <div className="member-card">
          <img src="" width="36" height="36" className="avatar-sm" alt="" />
          <div className="member-info">
            <strong>Placeholder Name</strong>
            <span className="muted">placeholder@company.com</span>
          </div>
        </div>
      </phantom-ui>
    </div>
  );
}

function RefetchButton() {
  return (
    <button
      className="refetch-btn"
      onClick={() => {
        queryClient.resetQueries();
      }}
    >
      Refetch all data
    </button>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="header">
          <h1>
            phantom-ui <span className="dim">+ React Query</span>
          </h1>
          <p className="subtitle">
            Data fetches with a 2s delay. The skeletons are generated from the
            real layout — no separate skeleton components.
          </p>
          <RefetchButton />
        </header>
        <div className="grid">
          <UserProfile />
          <PostList />
          <UserList />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
