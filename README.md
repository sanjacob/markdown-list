# Markdown List Action


## Inputs

### `file`

**Required** The file which contains the list.

### `header`

**Required** The header of the list to append to.

### `item`

**Required** The item you want to append.


## Notes

- The action will look for the first list under the specified
  header, regardless of level (`#`, `##`, `###`, etc).
- The item will be appended with the bullet style of the list.
- Empty lines are allowed after the list header.
- The list **MUST** not be empty (otherwise there is no list really)
- This action only works with unnumbered lists


## Example

```yaml
uses: sanjacob/markdown-list@v1
with:
    file: 'SHOPPING.md'
    header: 'Groceries'
    item: 'Beans'
```

With SHOPPING.md having the following content

#### Before

```md
### Groceries
- Eggs
- Bacon
```

#### After

```md
### Groceries
- Eggs
- Bacon
- Beans
```

## Demonstration

[Example repository](https://github.com/sanjacob/markdown-list-test)

## License

This software is distributed under the [3-Clause BSD License][license].

[license]: LICENSE
