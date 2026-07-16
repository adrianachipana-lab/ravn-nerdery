import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs } from './src/Tabs'

const TAB_COUNT = 3

function renderTabs() {
  return render(
    <Tabs defaultValue="a">
      <Tabs.List>
        <Tabs.Tab value="a">Tab A</Tabs.Tab>
        <Tabs.Tab value="b">Tab B</Tabs.Tab>
        <Tabs.Tab value="c">Tab C</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a">Panel A content</Tabs.Panel>
      <Tabs.Panel value="b">Panel B content</Tabs.Panel>
      <Tabs.Panel value="c">Panel C content</Tabs.Panel>
    </Tabs>,
  )
}

describe('Tabs (compound component)', () => {
  it('exposes the correct ARIA roles: one tablist, all tabs, one visible panel', () => {
    renderTabs()

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(TAB_COUNT)
    // Only the active tab's panel is rendered / visible.
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
  })

  it('shows the default tab panel and hides the others', () => {
    renderTabs()

    expect(screen.getByText('Panel A content')).toBeInTheDocument()
    expect(screen.queryByText('Panel B content')).not.toBeInTheDocument()
    expect(screen.queryByText('Panel C content')).not.toBeInTheDocument()
  })

  it('switches the visible panel when another tab is clicked', async () => {
    const user = userEvent.setup()
    renderTabs()

    await user.click(screen.getByRole('tab', { name: 'Tab B' }))

    expect(screen.getByText('Panel B content')).toBeInTheDocument()
    expect(screen.queryByText('Panel A content')).not.toBeInTheDocument()
  })

  it('tracks aria-selected on the active tab and updates after clicking', async () => {
    const user = userEvent.setup()
    renderTabs()

    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Tab C' })).toHaveAttribute('aria-selected', 'false')

    await user.click(screen.getByRole('tab', { name: 'Tab B' }))

    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'true')
  })
})
