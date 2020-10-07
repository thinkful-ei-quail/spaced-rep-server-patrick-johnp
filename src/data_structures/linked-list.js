class Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } 
    else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }
      tempNode.next = new Node(item, null);
    }
  }

  remove(item) {
    if (!this.head) {
      return null;
    }
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;
    while (currNode !== null && currNode.value !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      return;
    }
    previousNode.next = currNode.next;
  }

  insertAt(item, index) {
    let currNode = this.head;
    let currIndex = 0;
    if(index === 0) {
      item = new Node(item, currNode);
      this.head = item;
      return;
    }
    while (currNode !== null && currIndex < index) {
      currNode = currNode.next;
      currIndex++;
    }
    if (currNode === null) {
      this.insertLast(item);
      return;
    }
    item = new Node(item);
    item.next = currNode.next;
    currNode.next = item;
  }

  length() {
    let res = 0;
    let currNode = this.head;
    while(currNode) {
      currNode = currNode.next;
      res++;
    }
    return res;
  }

  display() {
    let currNode = this.head;
    let result = '';
    while (currNode !== null) {
      result +=
        currNode.next === null ? `${currNode.value.id}` : `${currNode.value.id} -> `;
      currNode = currNode.next;
    }
    return result;
  }
}

module.exports = LinkedList;