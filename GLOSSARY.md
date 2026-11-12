# Personal Website

Bradley Shellnut's personal site. Among other things, it shows a curated list of articles saved in Wallabag.

## Language

### Articles

**Tag Slug**:
The lowercase, URL-safe key that identifies a Wallabag tag, with any host-specific prefix (such as `t:`) removed. It is the key used to match a tag to an Allowed Tag.
_Avoid_: Tag ID, raw tag

**Tag Label**:
The text a person typed when creating a Wallabag tag. It is for display only and is never used as a matching key.
_Avoid_: Tag name

**Allowed Tag**:
A Tag Slug the site chooses to publish (the `ArticleTag` values). An article is published only if it has at least one Allowed Tag.
_Avoid_: Valid tag, article tag
