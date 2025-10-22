export function decks_create_pagination(params: {
  current_page: number
  total_pages: number
}): number[] {
  const { current_page, total_pages } = params

  // Guard invalid input
  if (total_pages <= 0) return []

  // If there are 10 or fewer pages, show all
  if (total_pages <= 10) {
    return Array.from({ length: total_pages }, (_, index) => index + 1)
  }

  const result: number[] = []

  // Start with either [1..10] or just [1] if current_page is 10 (special case per requirements)
  if (current_page === 10 || current_page > 10) {
    // For current_page >= 10, requirements expect not to list 2..10; start from 1 only
    result.push(1)
  } else {
    for (let page = 1; page <= 10 && page <= total_pages; page++) {
      result.push(page)
    }
  }

  // If current page is exactly 10, also show 11..19 (or until total_pages)
  if (current_page === 10 && total_pages > 10) {
    const end = Math.min(19, total_pages)
    for (let page = 11; page <= end; page++) {
      result.push(page)
    }
  }

  // Then decades by 10 up to 100 (only when current_page <= 10)
  if (current_page <= 10) {
    for (let page = 20; page <= Math.min(100, total_pages); page += 10) {
      result.push(page)
    }
  }

  // If there are more than 100 pages and current page is within first 10, add hundreds: 200, 300, ...
  if (total_pages > 100 && current_page <= 10) {
    for (let page = 200; page <= total_pages; page += 100) {
      result.push(page)
    }
  }

  // When current_page > 10: include anchors and current block depending on total size
  if (current_page > 10 && current_page <= total_pages) {
    const decade_start = Math.floor((current_page - 1) / 10) * 10 + 1
    const decade_end = Math.min(decade_start + 9, total_pages)
    if (total_pages <= 100) {
      // Add tens anchors before the current decade
      for (let page = 10; page < decade_start; page += 10) {
        result.push(page)
      }
    } else {
      // Add hundreds anchors up to and including the current hundred
      const current_hundred = Math.floor(current_page / 100) * 100
      for (
        let page = 100;
        page <= current_hundred && page <= total_pages;
        page += 100
      ) {
        result.push(page)
      }
      // Add the tens anchor immediately preceding the current decade (e.g., 230 for page 235)
      const tens_anchor = Math.floor(current_page / 10) * 10
      if (tens_anchor >= 10 && tens_anchor <= total_pages) {
        result.push(tens_anchor)
      }
    }
    for (let page = decade_start; page <= decade_end; page++) {
      result.push(page)
    }
    if (total_pages <= 100) {
      const next_decade = Math.floor(decade_end / 10) * 10 + 10
      for (let page = next_decade; page <= 100; page += 10) {
        result.push(page)
      }
    } else {
      // After current decade, add hundreds up to 1000
      const current_hundred = Math.floor(current_page / 100) * 100
      for (
        let page = current_hundred + 100;
        page <= Math.min(1000, total_pages);
        page += 100
      ) {
        result.push(page)
      }
      // Add final hundred and last page
      const last_hundred = Math.floor(total_pages / 100) * 100
      if (last_hundred > 1000 && last_hundred <= total_pages) {
        result.push(last_hundred)
      }
    }
  }

  // Ensure last page appears at the end
  if (!result.includes(total_pages)) {
    result.push(total_pages)
  }

  // Deduplicate and sort
  return Array.from(new Set(result)).sort((a, b) => a - b)
}
