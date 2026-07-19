from app.data.seed import clone_posts, clone_stories, get_profile
from app.schemas import Post, Story, UserProfile


class InMemoryStore:
    """Simple mutable store so likes / saves persist during the API process."""

    def __init__(self) -> None:
        self.posts: list[Post] = clone_posts()
        self.stories: list[Story] = clone_stories()
        self.profile: UserProfile = get_profile("u1")

    def get_post(self, post_id: str) -> Post | None:
        return next((p for p in self.posts if p.id == post_id), None)

    def toggle_like(self, post_id: str) -> Post | None:
        post = self.get_post(post_id)
        if not post:
            return None
        post.liked_by_me = not post.liked_by_me
        post.likes_count += 1 if post.liked_by_me else -1
        return post

    def toggle_save(self, post_id: str) -> Post | None:
        post = self.get_post(post_id)
        if not post:
            return None
        post.saved_by_me = not post.saved_by_me
        return post


store = InMemoryStore()
