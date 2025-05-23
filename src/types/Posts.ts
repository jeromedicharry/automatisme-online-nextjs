export interface PostCard {
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  title: string;
  date: string;
  excerpt: string;
  slug: string;
}

export interface PostsList {
  nodes: PostCard[];
}
