# Markdown List Action


## Inputs

### `header`

**Required** The header of the list to append to.

### `item`

**Required** The item you want to append.


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
