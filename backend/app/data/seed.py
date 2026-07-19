from copy import deepcopy
from datetime import datetime, timedelta, timezone

from app.schemas import Comment, Post, Story, User, UserProfile

NOW = datetime.now(timezone.utc)


USERS: dict[str, User] = {
    "u1": User(
        id="u1",
        username="you",
        display_name="You",
        avatar_url="https://i.pravatar.cc/150?u=you",
        is_verified=False,
    ),
    "u2": User(
        id="u2",
        username="maya.lens",
        display_name="Maya Chen",
        avatar_url="https://i.pravatar.cc/150?u=maya",
        is_verified=True,
    ),
    "u3": User(
        id="u3",
        username="jordan.eats",
        display_name="Jordan Lee",
        avatar_url="https://i.pravatar.cc/150?u=jordan",
        is_verified=False,
    ),
    "u4": User(
        id="u4",
        username="nova.studio",
        display_name="Nova Studio",
        avatar_url="https://i.pravatar.cc/150?u=nova",
        is_verified=True,
    ),
    "u5": User(
        id="u5",
        username="sam.outdoors",
        display_name="Sam Rivera",
        avatar_url="https://i.pravatar.cc/150?u=sam",
        is_verified=False,
    ),
}


PROFILES: dict[str, UserProfile] = {
    "u1": UserProfile(
        **USERS["u1"].model_dump(),
        bio="Building something new · SF",
        website="https://example.com",
        posts_count=12,
        followers_count=248,
        following_count=312,
    ),
    "u2": UserProfile(
        **USERS["u2"].model_dump(),
        bio="Photographer · golden hour forever",
        posts_count=186,
        followers_count=12400,
        following_count=420,
    ),
    "u3": UserProfile(
        **USERS["u3"].model_dump(),
        bio="Food finds & weekend recipes",
        posts_count=94,
        followers_count=8300,
        following_count=610,
    ),
    "u4": UserProfile(
        **USERS["u4"].model_dump(),
        bio="Design studio · product & brand",
        website="https://novastudio.example",
        posts_count=210,
        followers_count=45200,
        following_count=180,
    ),
    "u5": UserProfile(
        **USERS["u5"].model_dump(),
        bio="Trails, tents, and quiet mornings",
        posts_count=67,
        followers_count=5100,
        following_count=390,
    ),
}


POSTS: list[Post] = [
    Post(
        id="p1",
        user=USERS["u2"],
        image_url="https://picsum.photos/seed/gram1/1080/1350",
        caption="Soft light on the coast. #goldenHour",
        location="Big Sur, CA",
        likes_count=1284,
        comments_count=2,
        created_at=NOW - timedelta(hours=2),
        comments=[
            Comment(
                id="c1",
                user=USERS["u3"],
                text="This color is unreal 🔥",
                created_at=NOW - timedelta(hours=1),
                likes_count=12,
            ),
            Comment(
                id="c2",
                user=USERS["u5"],
                text="Need this on my wall",
                created_at=NOW - timedelta(minutes=40),
                likes_count=3,
            ),
        ],
    ),
    Post(
        id="p2",
        user=USERS["u3"],
        image_url="https://picsum.photos/seed/gram2/1080/1080",
        caption="Saturday brunch plate. Worth the wait.",
        location="Oakland",
        likes_count=642,
        comments_count=1,
        created_at=NOW - timedelta(hours=5),
        comments=[
            Comment(
                id="c3",
                user=USERS["u2"],
                text="Recipe please!!",
                created_at=NOW - timedelta(hours=4),
                likes_count=8,
            ),
        ],
    ),
    Post(
        id="p3",
        user=USERS["u4"],
        image_url="https://picsum.photos/seed/gram3/1080/1350",
        caption="New brand system in the wild.",
        likes_count=2103,
        comments_count=0,
        created_at=NOW - timedelta(hours=9),
    ),
    Post(
        id="p4",
        user=USERS["u5"],
        image_url="https://picsum.photos/seed/gram4/1080/1080",
        caption="Camp coffee hits different at 6am.",
        location="Yosemite",
        likes_count=891,
        comments_count=0,
        created_at=NOW - timedelta(days=1),
    ),
    Post(
        id="p5",
        user=USERS["u2"],
        image_url="https://picsum.photos/seed/gram5/1080/1350",
        caption="City grain.",
        location="San Francisco",
        likes_count=455,
        comments_count=0,
        created_at=NOW - timedelta(days=2),
    ),
]


STORIES: list[Story] = [
    Story(
        id="s1",
        user=USERS["u1"],
        image_url="https://picsum.photos/seed/storyyou/720/1280",
        created_at=NOW - timedelta(minutes=30),
        seen=False,
    ),
    Story(
        id="s2",
        user=USERS["u2"],
        image_url="https://picsum.photos/seed/storymaya/720/1280",
        created_at=NOW - timedelta(hours=1),
        seen=False,
    ),
    Story(
        id="s3",
        user=USERS["u3"],
        image_url="https://picsum.photos/seed/storyjordan/720/1280",
        created_at=NOW - timedelta(hours=3),
        seen=True,
    ),
    Story(
        id="s4",
        user=USERS["u4"],
        image_url="https://picsum.photos/seed/storynova/720/1280",
        created_at=NOW - timedelta(hours=4),
        seen=False,
    ),
    Story(
        id="s5",
        user=USERS["u5"],
        image_url="https://picsum.photos/seed/storysam/720/1280",
        created_at=NOW - timedelta(hours=6),
        seen=True,
    ),
]


def clone_posts() -> list[Post]:
    return [deepcopy(p) for p in POSTS]


def clone_stories() -> list[Story]:
    return [deepcopy(s) for s in STORIES]


def get_profile(user_id: str = "u1") -> UserProfile:
    return deepcopy(PROFILES[user_id])
