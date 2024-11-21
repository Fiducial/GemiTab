export class MockModel {
  static basicResponse() {
    return `Basic only-text response`;
  }

  static responseWithActions() {
    return `
            This is a response containing actions.
            Edit the source code with relevant tab ids to test actions.
            
            TAB_ACTIONS
            type - focusTab
            10

            type - openTabs
            https://github.com
            https://gemini.google.com

            type - closeTabs
            1369404167
            1369403308

            type - muteTabs
            1369404167

            type - unmuteTabs
            1369404167

            type - saveMedia
            https://example.com/image.png

            type - compareTabs
            12
            42

            type - pinTabs
            1369402466
            1369402464

            type - unpinTabs
            1369402466
            1369402464

            type - discardTabs
            1369404303

            type - copyUrls
            https://example.com
            https://github.com
            `;
  }
}
