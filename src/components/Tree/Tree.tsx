import * as React from 'react';
import * as classNames from 'classnames';

import './Tree.less';
import Table from '../Table/Table';

export interface ITreeProps {
 dataSource? : any; 
 columns? : any;
 parentKey? : string;
 uniqueKey? : string;
 selectedElements? : Array<any>;
 openedElements?: Array<any>;
 selectedKey?: string;
 onRowSelect?: any;
 filterOpenDetailTemplate?: any;
}

export default class Tree extends React.Component<ITreeProps, any>{

  public static defaultProps = {
      parentKey: 'ParentId',
      uniqueKey: 'Id'
  };

  constructor(props) {
    super(props);
    this.state = {
      newArray : [], 
      roots: [],
      map: {},
      openedKeys: []
    }
  }
  componentDidMount() {
      this.initArray(this.props.dataSource);

      if (this.props.selectedElements && this.props.selectedElements.length > 0) {
          this.openSelectedElements(this.props.selectedElements);
      }
  }
  componentWillReceiveProps(nextProps) {

      if (nextProps.selectedElements && nextProps.selectedElements.length > 0) {
          this.openSelectedElements(nextProps.selectedElements);
      }
  }
  initArray(dataSource) {
    let {columns, parentKey, uniqueKey} = this.props;
    let newArray = [];
    let map = {}

    let createNodeTree = (item, index) =>{
      newArray.push({
        item: item,
        Id: item[uniqueKey],
        parentId: item[parentKey],
        children : []
      });
      map[item[uniqueKey]] = index;
    }

    if (dataSource.length) {
        dataSource.map(createNodeTree);
    }

    this.setState({
      newArray : newArray,
      map: map
    }, () => {
      this.updateRoots()
    })
  }
  updateRoots(){
    let {columns, parentKey, uniqueKey} = this.props;
    let newArray = this.state.newArray;
    let map = this.state.map;
    let roots = [];

    if (newArray.length === this.props.dataSource.length) {
      for (let i = 0; i < newArray.length; i += 1) {
          let node = newArray[i];
          node.parentId !== 0 ? newArray[map[node.parentId]].children.push(node) : roots.push(node);
      }
    } 

    this.setState({ roots: roots }, () => {
        this.props.selectedElements && this.props.selectedElements.length > 0 ? this.openSelectedElements(this.props.selectedElements) : null;
        this.props.openedElements && this.props.openedElements.length > 0 ? this.openedElements(this.props.openedElements) : null;
    });

  }
  openSelectedElements(selectedElements) {
      let newArray = this.state.newArray;
      let openedKeys = [];

      let gotoParentAndPushKey = (selectedKeyIndex, node ? : any) => {
          let currentSelectedKeyIndex = selectedKeyIndex || 0; 

          let currentNode = node || newArray.filter(function (node) {
              return node.Id === selectedElements[selectedKeyIndex];
          })

          let theNode = currentNode[0];

          if (theNode && theNode.parentId !== 0) {
              openedKeys.push(theNode.parentId); 

              let parentNode = newArray.filter(function (node) {
                  return node.Id === theNode.parentId;
              })

              if (parentNode[0].parentId === 0) {
                  return null
              } else {
                  return gotoParentAndPushKey(currentSelectedKeyIndex, parentNode);
              }
              
          } 
      }

      gotoParentAndPushKey(0);

      this.setState({
          openedKeys: openedKeys
      })

  }

  openedElements(selectedElements) {
      let newArray = this.state.newArray;
      let openedKeys = [];

      let gotoParentAndPushKey = (selectedKeyIndex, node?: any) => {
          let currentSelectedKeyIndex = selectedKeyIndex || 0;

          let currentNode = node || newArray.filter(function (node) {
              return node.Id === selectedElements[selectedKeyIndex];
          })

          let theNode = currentNode[0];

          if (theNode && theNode.parentId !== 0) {
              openedKeys.push(theNode.parentId);

              let parentNode = newArray.filter(function (node) {
                  return node.Id === theNode.parentId;
              })

              if (parentNode[0].parentId === 0) {
                  return null
              } else {
                  return gotoParentAndPushKey(currentSelectedKeyIndex, parentNode);
              }

          }
      }

      gotoParentAndPushKey(0);

      this.setState({
          openedKeys: openedKeys
      })

  }

  renderChildren(childNode) {
      let {columns, parentKey, uniqueKey, filterOpenDetailTemplate, openedElements, selectedElements, onRowSelect} = this.props;
      return (
        <Table 
          hideHeader 
          key={childNode.Id} 
          className={"pl20"} 
          columns={columns} 
          dataSource={childNode.children} 
          detailTemplate={this.renderChildren.bind(this) }
          filterOpenDetailTemplate={filterOpenDetailTemplate}
          hidePageSize
          selectedKey={uniqueKey}
          selectedElements={this.props.selectedElements}
          detailTemplateSelectedElements={this.state.openedKeys.concat(openedElements)}
          pageSize={childNode.children.length}
      />
      )
  }
  render() {
    const self = this;
    const props = self.props;
    let {dataSource, columns, selectedElements, openedElements, uniqueKey, filterOpenDetailTemplate, onRowSelect} = props;
    let state = self.state;
    let {roots} = state;

    if (roots.length) {
        return (
            <div className="r-Tree e-scroll-y">
                <Table
                    hideHeader
                    columns={columns} 
                    dataSource={roots}
                    detailTemplate={this.renderChildren.bind(this) }
                    filterOpenDetailTemplate={filterOpenDetailTemplate}
                    hidePageSize
                    selectedKey={uniqueKey}
                    selectedElements={this.props.selectedElements}
                    detailTemplateSelectedElements={this.state.openedKeys.concat(openedElements)}
                    pageSize={roots.length}
                    />
                    
            </div>
        )
    } else return null;
  }
}