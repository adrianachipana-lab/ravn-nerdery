import { Tabs } from './Tabs'

export default function Demo() {
  return (
    <main>
      <h1>W3 · Patterns — Compound Tabs</h1>
      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="specs">Specs</Tabs.Tab>
          <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <p>A compound component composed without prop drilling.</p>
        </Tabs.Panel>
        <Tabs.Panel value="specs">
          <p>Active tab state lives in React context, shared by sub-components.</p>
        </Tabs.Panel>
        <Tabs.Panel value="reviews">
          <p>Consumers just compose Tabs.List / Tabs.Tab / Tabs.Panel.</p>
        </Tabs.Panel>
      </Tabs>
    </main>
  )
}
