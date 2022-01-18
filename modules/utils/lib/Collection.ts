const getId = (item: any) => typeof item === 'object' && 'id' in item ? item.id : item

class Collection<Item, Key = string> extends Map<Key, Item> {

    public constructor(item: Item[] = []) {
        super()
        if (item) this.add(item)
    }

    public add(item: Item): Item
    public add(items: Item[]): Item[]
    public add(item: Item | Item[]) {
        if (Array.isArray(item)) {
            const result: Item[] = []

            for (const i of item) {
                const added = this.add(i)
                if (added) result.push(added)
            }

            return result
        } else {
            if (this.has(getId(item))) return undefined
            this.set(getId(item), item)
            return item
        }
    }

    public remove(ids: Key): Item | undefined
    public remove(ids: Key[]): Item[]
    public remove(id: Key | Key[]) {
        if (Array.isArray(id)) {
            const result: Item[] = []

            for (const i of id) {
                const removed = this.remove(i)
                if (removed) result.push(removed as Item)
            }

            return result
        } else {
            const item = this.get(id)
            this.delete(id)
            return item
        }
    }

    public get(key: Key): Item | undefined {
        return super.get(getId(key))
    }

    public has(key: Key): boolean {
        return super.has(getId(key))
    }

    public delete(key: Key): boolean {
        return super.delete(getId(key))
    }

    public transfer(id: string, destination: Collection<Item>): Item | undefined
    public transfer(id: string[], destination: Collection<Item>): Item[]
    public transfer(id: string | string[], destination: Collection<Item>) {
        const item = this.remove(id as unknown as Key)
        if (!item) return item
        return destination.add(item) as any
    }

    public toArray() {
        return Array.from(this.values())
    }

}

export default Collection