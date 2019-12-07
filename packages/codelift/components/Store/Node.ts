import { Instance, types } from "mobx-state-tree";
import { TailwindRule } from "./TailwindRule";

type Rule = Instance<typeof TailwindRule>;

export const Node = types
  .model("Node", {
    classNames: types.array(types.string),
    isPreviewing: false
  })
  .volatile(self => ({
    element: null as null | HTMLElement
  }))
  .views(self => ({
    get debugSource() {
      if (!this.reactElement) {
        return undefined;
      }

      if (!this.reactElement._debugSource) {
        throw new Error(`Selected element is missing _debugSource property`);
      }

      return this.reactElement._debugSource;
    },

    hasRule(rule: Rule) {
      if (!self.element) {
        return false;
      }

      return self.classNames.includes(rule.className);
    },

    get reactElement() {
      if (!self.element) {
        return undefined;
      }

      for (const key in self.element) {
        if (key.startsWith("__reactInternalInstance$")) {
          // @ts-ignore
          return self.element[key];
        }
      }
    },

    get selector() {
      let { element } = self;

      if (!element) {
        return null;
      }

      const selectors = [];

      while (element) {
        const nthChild = element.parentNode
          ? [...element.parentNode.childNodes]
              .filter(node => node.nodeType === 1)
              .indexOf(element) + 1
          : null;
        const { id, tagName } = element;

        selectors.unshift(
          [
            tagName.toLowerCase(),
            id && `#${element.id}`,
            !id && nthChild && `:nth-child(${nthChild})`
          ]
            .filter(Boolean)
            .join("")
        );

        element = element.parentElement;
      }

      return selectors.join(" > ");
    }
  }))
  .actions(self => ({
    applyRule(rule: Rule) {
      if (self.element) {
        if (self.hasRule(rule)) {
          self.element.classList.remove(rule.className);
        } else {
          self.element.classList.add(rule.className);
        }

        self.classNames.replace([...self.element.classList]);
      }
    },

    cancelRule(rule: Rule) {
      if (self.element) {
        self.element.className = self.classNames.join(" ");
      }

      self.isPreviewing = false;
    },

    previewRule(rule: Rule) {
      if (self.element) {
        if (self.hasRule(rule)) {
          self.element.classList.remove(rule.className);
        } else {
          self.element.classList.add(rule.className);
        }

        self.isPreviewing = true;
      }
    },

    set(element: HTMLElement) {
      self.classNames.replace([...element.classList]);
      self.element = element;
    },

    unset() {
      self.element = null;
    }
  }));