import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  CommandsExtension,
  extension,
  ExtensionTag,
  InputRule,
  KeyBindings,
  NamedShortcut,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  object,
  ProsemirrorAttributes,
  ProsemirrorNode,
  setBlockType,
  Static,
  toggleBlockItem,
  CoreIcon,
  ExtensionConstructor,
} from "@remirror/core";
import { textblockTypeInputRule } from "@remirror/pm/inputrules";
import { NodePasteRule } from "@remirror/pm/paste-rules";

import { ExtensionHeadingMessages } from "@remirror/messages";

const { LABEL } = ExtensionHeadingMessages;

/**
 * The named shortcuts for the default 6 levels of commands.
 */
export const shortcuts = [
  NamedShortcut.H1,
  NamedShortcut.H2,
  NamedShortcut.H3,
  NamedShortcut.H4,
  NamedShortcut.H5,
  NamedShortcut.H6,
];

export interface HeadingOptions {
  /**
   * The numerical value of the supporting headings.
   *
   * @defaultValue `[1, 2, 3, 4, 5, 6]`
   */
  levels?: Static<number[]>;

  /**
   * The default level heading to use.
   *
   * @defaultValue 1
   */
  defaultLevel?: Static<number>;
}

export type HeadingExtensionAttributes = ProsemirrorAttributes<{
  /**
   * The heading size.
   */
  level?: number;
}>;

export interface HeadingOptions {}

@extension<HeadingOptions>({
  defaultOptions: {
    levels: [1, 2, 3, 4, 5, 6],
    defaultLevel: 1,
  },
  staticKeys: ["defaultLevel", "levels"],
})
// @ts-ignore
export class HeadingExtension extends NodeExtension<HeadingOptions> {
  inputEmitter: (match: RegExpMatchArray) => void;
  pasteEmitter: (match: RegExpMatchArray) => void;

  constructor(
    emitter: (match: RegExpMatchArray) => void,
    pasteEmitter: (match: RegExpMatchArray) => void
  ) {
    super();
    this.inputEmitter = emitter;
    this.pasteEmitter = pasteEmitter;
  }

  get name() {
    return "heading" as const;
  }

  createTags() {
    return [
      ExtensionTag.Block,
      ExtensionTag.TextBlock,
      ExtensionTag.FormattingNode,
    ];
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
    return {
      content: "inline*",
      defining: true,
      draggable: false,
      ...override,
      attrs: {
        ...extra.defaults(),
        level: {
          default: this.options.defaultLevel,
        },
      },
      parseDOM: [
        ...this.options.levels.map((level) => ({
          tag: `h${level}`,
          getAttrs: (element: string | Node) => ({
            ...extra.parse(element),
            level,
          }),
        })),
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node: ProsemirrorNode) => {
        return [
          "div",
          {
            hidden: "true",
          },
          0,
        ];
      },
    };
  }

  /**
   * Toggle the heading for the current block. If you don't provide the
   * level it will use the options.defaultLevel.
   */
  // @command(toggleHeadingOptions)
  // toggleHeading(attrs: HeadingExtensionAttributes = {}): CommandFunction {
  //   return toggleBlockItem({
  //     type: this.type,
  //     toggleType: "paragraph",
  //     attrs,
  //   });
  // }

  /**
   * Dynamically create the shortcuts for the heading extension.
   */
  createKeymap(fn: (shortcut: string) => string[]): KeyBindings {
    const commandsExtension = this.store.getExtension(CommandsExtension);
    const keys: KeyBindings = object();
    const attrShortcuts: Array<{
      shortcut: string;
      attrs: ProsemirrorAttributes;
    }> = [];

    for (const level of this.options.levels) {
      const shortcut = shortcuts[level - 1] ?? NamedShortcut.H1;
      keys[shortcut] = setBlockType(this.type, { level });

      // Dynamically add the attribute specific shortcut to the array of
      // attribute shortcuts.
      attrShortcuts.push({ attrs: { level }, shortcut: fn(shortcut)[0] });
    }

    // commandsExtension.updateDecorated("toggleHeading", {
    //   shortcut: attrShortcuts,
    // });
    return keys;
  }

  createInputRules(): InputRule[] {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule(
        new RegExp(`^(#{1,${level}})\\s$`),
        this.type,
        (match) => ({
          emitter: this.inputEmitter(match),
          level,
        })
      );
    });
  }

  createPasteRules(): NodePasteRule[] {
    return this.options.levels.map((level) => ({
      type: "node",
      nodeType: this.type,
      regexp: new RegExp(`^#{${level}}\\s([\\s\\w]+)$`),
      getAttributes: () => ({ level }),
      getContent: (match) => {
        this.pasteEmitter(match);
      },
    }));
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      // @ts-ignore
      heading: HeadingExtension;
    }
  }
}
