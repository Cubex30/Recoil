import * as React from 'react';

import {arraysEqual, search, branchIn} from '../Utils';

import { ITableProps } from '../Table/Table';
import Emerge from '../Emerge/Emerge';
import Toolbar from '../Toolbar/Toolbar';
import Button from '../Button/Button';
import {IColumn} from './IColumn';

export interface IDataSourceProps extends ITableProps {
    // initial dataSource loaded as prop
    dataSource?: Array<Object> | Array<number> | Array<string>;
    columns?: Array<IColumn>;
    emptyText: string;
    loading?: boolean;
    loadingText?: string;
}

const DataSource : any = (Component : JSX.Element) =>
    class Enhance extends React.Component<IDataSourceProps, any> {

        public static defaultProps = {
            emptyText: 'dataSource is empty'
        }

        constructor(props : IDataSourceProps) {
            super(props);

            this.state = {
                // dataSource
                dataSource: [],
                isArray: false,
                columns: [],
                activeRows: [],
                // page
                pageSize: props.pageSize || 10,
                page: props.page || 0,
                numberOfPages: 0,
                numberPerPage: 0,

                // table selected options
                detailTemplateSelectedElements: props.detailTemplateSelectedElements || [],
                selectedElements: props.selectedElements || [],
                // table search
                searchTerm: '',
                searchedItems: [],
                // table sort
                sortType: props.sortType || "asc",
                sortKey: props.sortKey || null
            }
        }

        componentWillReceiveProps(nextProps : IDataSourceProps) {

            let {dataSource, sortKey} = nextProps;

            this.setState({
                page: nextProps.page !== this.props.page ? nextProps.page : this.state.page,
                pageSize: nextProps.pageSize !== this.props.pageSize ? nextProps.pageSize : this.state.pageSize,
                rowCount: nextProps.rowCount !== this.props.rowCount ? nextProps.rowCount : this.state.rowCount,
            })

            if (nextProps.selectedElements) {
                this.setState({
                    selectedElements: nextProps.selectedElements
                })
            }
            if (nextProps.detailTemplateSelectedElements) {
                this.setState({
                    detailTemplateSelectedElements: nextProps.detailTemplateSelectedElements
                })
            }

            if (sortKey) {
                this.sortDataSource(dataSource, this.state.sortType, sortKey);
            } else {
                if (nextProps.dataSource && !nextProps.page) {
                    //this.setState({
                    //    page: 0
                    //})
                    dataSource.length ? this.loadDataSource(dataSource) : this.loadDataSource([]);
                } else {
                    dataSource.length ? this.loadDataSource(dataSource) : this.loadDataSource([]);
                }
            }

            if (nextProps.searchValue !== this.props.searchValue) {
                this.filterItems(nextProps.searchValue, nextProps.searchableKeys);
            }
        }

        componentDidMount() {
            const self = this;
            const props = self.props;

            let {dataSource} = props;
            
            dataSource && Object.keys(dataSource).length || dataSource && dataSource.length ? self.loadDataSource(dataSource) : self.loadDataSource([]);
        }

        loadDataSource<T>(dataSource : Array<T>) {
            const self = this;

            let dataSourceIsObject = typeof dataSource === 'object';
            let dataSourceIsArray = dataSource instanceof Array;
            let dataSourceIsArrayOfStingsOrNumbers = typeof dataSource[0] === 'string' || typeof dataSource[0] === 'number';
            let updatedDataSource = [];

            let {sortKey} = this.props;
            let {sortType} = this.state;


            let setDataSourceState = (dataSource : Array<T> | Array<Array<T>>, isArray : boolean) => {
                updatedDataSource = dataSource;
                self.setState({
                    dataSource: dataSource,
                    isArray: isArray
                }, () => {
                    this.defineColumns(dataSource);

                    if (sortKey && sortType) {
                        self.sortDataSource(dataSource, sortType, sortKey);
                    } else {
                        self.renderActiveRows(dataSource);
                    }

                })
            }

            if (dataSourceIsArray) {
                if (dataSourceIsArrayOfStingsOrNumbers) {
                    let newDataSource: Array<T> = [];

                    dataSource.forEach(element => {
                        newDataSource.push(element)
                    });

                    setDataSourceState(newDataSource, true);

                } else {
                    setDataSourceState(dataSource, false);
                }
            } else if (dataSourceIsObject) {
                setDataSourceState([dataSource], false);
            } else {
                setDataSourceState(dataSource, false)
            }
        }

        sortDataSource(dataSource: Array<any>, sortType: string, sortKey: string) {
            const self = this;

            let {searchedItems, searchTerm} = self.state;

            let sortOrderSearchedItems: Array<any>;
            let sortOrderDataSource: Array<any>;

            let sort = (dataSource: Array<any>) => {
                return dataSource.sort(function (a, b) {
                    let aKey = branchIn(a, sortKey);
                    let bKey = branchIn(b, sortKey);
                    switch (typeof aKey) {
                        case ('string'):
                            let itemPrev = aKey && aKey.toLowerCase();
                            let itemNext = bKey && bKey.toLowerCase();
                            if (itemPrev < itemNext) //string asc
                                return -1
                            if (itemPrev > itemNext)
                                return 1
                            break;
                        case ('number'):
                            return aKey - bKey;
                        default:
                            return null;
                    }
                    return null;
                })
            }

            if (sortType === 'asc') {
                sortOrderDataSource = sort(dataSource);
                sortOrderSearchedItems = sort(searchedItems);
            } else {
                sortOrderDataSource = sort(dataSource).reverse();
                sortOrderSearchedItems = sort(searchedItems).reverse();
            }

            if (searchTerm !== '') {
                self.setState({
                    dataSource: sortOrderDataSource,
                    searchedItems: sortOrderSearchedItems
                }, () => {
                    self.renderActiveRows(sortOrderSearchedItems);
                })
            } else {
                self.setState({
                    dataSource: sortOrderDataSource,
                }, () => {
                    self.renderActiveRows(sortOrderDataSource);
                })
            }

        }

        defineColumns(dataSource: Array<any>) {
            const self = this;
            const props = self.props;
            let state = self.state;

            let {columns} = props;
            let {isArray} = state;

            let columnsArray: Array<any>;

            // columns are defined
            if (dataSource.length > 0){
                if (columns) {
                    columnsArray = columns;
                }
                // else automatically create them
                else {
                    columnsArray = [];
    
                    if (isArray) {
                        columnsArray.push({ name: '_Array' });
                    } else {
                        Object.keys(dataSource[0]).map((key) => {
                            columnsArray.push({ name: key })
                        })
                    }
                }
            }

            this.setState({
                columns: columnsArray
            })
        }

        renderActiveRows(dataSource: Array<any>) {
            const self = this;
            const props = self.props;
            let {rowCount} = props;

            let activeRows : Array<any> = [];

            let numberPerPage, numberOfPages, renderedPage;

            let {page, pageSize} = self.state;

            if (this.state.searchTerm !== '') {
                renderedPage = this.state.searchedItems;
            } else {
                renderedPage = dataSource
            }

            if (rowCount) {
                numberPerPage = pageSize;
                numberOfPages = Math.ceil(rowCount / pageSize);
            } else {
                numberPerPage = pageSize;
                numberOfPages = Math.ceil(renderedPage.length / (pageSize));
            }

            this.setState({
                numberPerPage: numberPerPage,
                numberOfPages: numberOfPages
            })

            let begin = ((page) * parseInt(numberPerPage));
            let end = begin + parseInt(numberPerPage);
            let pageList = renderedPage.slice(begin, end);

            pageList.map((item: Array<any>) => {
                activeRows.push(item);
            })

            this.setState({
                activeRows: activeRows
            });

            //this.props.searchValue ? this.filterItems(this.props.searchValue, this.props.searchableKeys) : null;
        }

        detailTemplateToggleAll(dataSource: Array<any>) {
            let {detailTemplateSelectedElements} = this.state;

            this.setState({
                detailTemplateSelectedElements: arraysEqual(dataSource, detailTemplateSelectedElements) ? [] : dataSource
            })
        }

        detailTemplateToggleSelectedElements(element: Array<any>) {
            const self = this;
            let {detailTemplateOpenOnRowSelect, selectedKey} = this.props;
            let {detailTemplateSelectedElements} = self.state;

            let selectedElementsArray: any;
             
            let setSelectedElementsState = (data: Array<any>) => {
                self.setState({
                    detailTemplateSelectedElements: data
                })
            }

            if (detailTemplateOpenOnRowSelect === 'single') {
                selectedElementsArray = detailTemplateSelectedElements.length ? [detailTemplateSelectedElements[0]] : [];
                self.props.detailTemplateOnOpen ? self.props.detailTemplateOnOpen(element) : null;
            } else {
                selectedElementsArray = detailTemplateSelectedElements.slice();
            }

            if (selectedElementsArray.includes(selectedKey ? element[selectedKey] : element)) {
                selectedElementsArray.map((data: string, key : string | number) => {
                    if (data === selectedKey ? element[selectedKey] : element) {
                        selectedElementsArray.splice(key, 1);
                        setSelectedElementsState(selectedElementsArray)
                    }
                })
            } else {
                if (detailTemplateOpenOnRowSelect === 'single') {
                    selectedElementsArray = [];
                    selectedElementsArray.push(selectedKey ? element[selectedKey] : element);
                    setSelectedElementsState(selectedElementsArray)

                } else {
                    selectedElementsArray.push(selectedKey ? element[selectedKey] : element);
                    setSelectedElementsState(selectedElementsArray)
                }
            }
        }

        selectAll(dataSource: Array<any>) {
            let {selectedElements} = this.state;

            this.setState({
                selectedElements: arraysEqual(dataSource, selectedElements) ? [] : dataSource
            })
        }

        toggleSelectedElements(element: Array<any>, index: string | number) {
            const self = this;
            let {selectedElements} = self.state;
            let {rowIsSelectable, onCheck, selectedKey} = self.props;
            let selectedElement = selectedKey ? element[selectedKey] : element;
            let selectedElementsArray: any;

            if (rowIsSelectable === 'single') {
                selectedElementsArray = [];
            } else {
                selectedElementsArray = selectedElements.slice();
            }

            if (selectedElementsArray.includes(selectedElement)) {
                for (let i = 0; i < selectedElementsArray.length; i++) {
                    if (selectedElementsArray[i] === (selectedElement)) {
                        selectedElementsArray.splice(i, 1);

                        self.setState({
                            selectedElements: selectedElementsArray
                        },()=>{
                            this.props.onRowSelect ? this.props.onRowSelect(element, index, selectedElementsArray) : null;
                        })
                    }
                }
            } else {
                selectedElementsArray.push(selectedElement);

                self.setState({
                    selectedElements: selectedElementsArray
                },()=>{
                    this.props.onRowSelect ? this.props.onRowSelect(element, index, selectedElementsArray) : null;
                })

                onCheck ? onCheck(selectedElement) : null;
            }
        }

        firstPage() {
            this.setState({
                page: 0
            }, () => {
                this.renderActiveRows(this.state.dataSource);
            })
            this.props.onPageChange ? this.props.onPageChange(0) : null
        }

        previousPage() {
            let pageNumber = this.state.page;
            this.props.onPageChange ? this.props.onPageChange(this.state.page - 1) : null;
            if (!this.props.serverSide) {
                this.setState({
                    page: pageNumber -= 1
                }, () => {
                    this.renderActiveRows(this.state.dataSource);
                })
            }
        }

        nextPage() {
            let pageNumber = this.state.page;
            this.setState({
                page: pageNumber += 1
            }, () => {
                this.renderActiveRows(this.state.dataSource);
                this.props.onPageChange ? this.props.onPageChange(this.state.page) : null
            })

        }

        lastPage(numberOfPages : number) {
            this.setState({
                page: numberOfPages - 1
            }, () => {
                this.renderActiveRows(this.state.dataSource);
            })
            this.props.onPageChange ? this.props.onPageChange(numberOfPages - 1) : null
        }

        gotoPage(i : number) {
            this.setState({
                page: i,
                pageSize: this.state.pageSize,
            }, () => {
                this.renderActiveRows(this.state.dataSource);
            })
        }

        changePageSize(pageSize : any) {
            this.setState({
                pageSize: pageSize,
                page: 0
            }, () => {
                this.renderActiveRows(this.state.dataSource);
            })

            this.props.onPageSizeChange ? this.props.onPageSizeChange(pageSize) : null;
        }

        sortCollection(dataSource: Array<any>, key: string, sortType : string) {
            const self = this;

            let sortKey = this.props.sortKey ? this.props.sortKey : key;

            self.setState({
                sortKey: sortKey,
                sortType: sortType
            }, () => {
                self.sortDataSource(dataSource, sortType, sortKey);
            })
        }

        toggleSorting(dataSource: Array<any>, key: string, sortType: string) {
            const self = this;
            self.sortCollection(dataSource, key, sortType);
        }

        filterItems(term: string, keys: Array<any>) {
            const self = this;
            let state = self.state;

            self.setState({
                searchedItems: search(state.dataSource, term, keys, self.props.searchFilter),
                searchTerm: term,
                page: 0
            }, () => {
                self.renderActiveRows(state.dataSource);
            })

        }

        render() {

            const self = this;
            const props = self.props;
            let {columns, dataSource, activeRows} = self.state;
            //let {emptyText} = props;

            let renderedObject = {
                // methods
                gotoPage: this.gotoPage.bind(this),
                previousPage: this.previousPage.bind(this),
                nextPage: this.nextPage.bind(this),
                lastPage: this.lastPage.bind(this),
                firstPage: this.firstPage.bind(this),
                changePageSize: this.changePageSize.bind(this),

                detailTemplateToggleSelectedElements: this.detailTemplateToggleSelectedElements.bind(this),
                detailTemplateToggleAll: this.detailTemplateToggleAll.bind(this),
                selectAll: this.selectAll.bind(this),
                toggleSelectedElements: this.toggleSelectedElements.bind(this),

                sortCollection: this.sortCollection.bind(this),
                toggleSorting: this.toggleSorting.bind(this),
                filterItems: this.filterItems.bind(this),
            }

            if (props.loading) {
                return (
                    <Emerge className="e-fill">
                        <Toolbar block textCenter>
                            <Button loading={true} block size="large" simple>{props.loadingText}</Button>
                        </Toolbar> 
                    </Emerge>  
                )
            }
            else if ((activeRows.length || dataSource.length) && columns && columns.length) {
                const newProps = Object.assign({}, props, self.state, renderedObject);
                // clone the original component and add the new props
                const updatedComponent = React.cloneElement(Component, newProps, Component.props);
                // only if a dataSource exists return the new element - else return original
                return dataSource.length ? updatedComponent : Component;
            } else {
                return (
                    <Emerge className="e-fill">
                        <Toolbar block textCenter>
                            <Button block size="large" simple>{props.emptyText}</Button>
                        </Toolbar> 
                    </Emerge>  
                )
            }
        }
};

export default DataSource;