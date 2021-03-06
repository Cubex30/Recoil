import * as React from 'react';

import Toolbar from '../Toolbar/Toolbar';
import Button from '../Button/Button';
import Dropdown from '../Dropdown/Dropdown';

export interface IPagerProps {
    gotoPage?: (pageNumber: number, event?: React.MouseEvent<HTMLElement>) => void;
    currentPage?: number;
    changePageSize?: (pageSizeAmount: number, event?: React.MouseEvent<HTMLElement>) => void;
    firstPage?: (event: React.MouseEvent<any>) => void;
    nextPage?: (event: React.MouseEvent<any>) => void;
    numberOfPages?: number;
    numberPerPage?: number;
    lastPage?: (event: React.MouseEvent<any>) => void;
    previousPage?: (event: React.MouseEvent<any>) => void;
    dataSource?: Array<Object>;
    pageSize?: number;
    onPageChange?: (pageNumber: number, event?: React.MouseEvent<any>) => void;
    pageSizerOptions?: Array<number>;
    hidePageSize?: boolean;
    rowCount?: number;
    showDataSourceLength?: boolean;
    hideHeader?: boolean;
    title?: string;
    pagerSize?: number;
    className?: string;
}

export default class Pager extends React.Component<IPagerProps, {}>{

    gotoPage(pageNumber: number) {
        this.props.gotoPage(pageNumber);
        this.props.onPageChange ? this.props.onPageChange(pageNumber) : null
    }

    onSelected(pageSizeAmount: number) {
        this.props.changePageSize(pageSizeAmount);
    }

    lastPage(numberOfPages: React.MouseEvent<any>) {
        this.props.lastPage(numberOfPages);
    }

    renderPager(page: number, pageCount: number, pagerSize: number) {

        const self = this;

        let {
          currentPage,
      } = this.props;

        var lastPager = page + Math.floor(pagerSize / 2);
        var firstPager = page - Math.ceil(pagerSize / 2) + 1;
        if (firstPager < 0) {
            lastPager -= firstPager;
            firstPager = 0;
        }
        if (lastPager >= pageCount) {
            var difference = lastPager - (pageCount - 1);
            lastPager -= difference;
            firstPager -= difference;
            if (firstPager < 0) {
                firstPager = 0;
            }
        }
        var pagers = [];
        for (var index = firstPager; index <= lastPager; index++) {
            pagers.push(
                <Button simple block size="small" tabIndex={-1} advanced checked={currentPage === index ? true : false} onClick={this.gotoPage.bind(self, index)} key={index}>
                    {index + 1}
                </Button>
            );
        }
        return pagers;
    }

    render() {

        const self = this;

        let props = self.props;

        let {
      currentPage,
            firstPage,
            previousPage,
            nextPage,
            pageSize,
            pageSizerOptions,
            numberOfPages,
            dataSource,
            rowCount,
            hidePageSize,
            pagerSize
    } = props;

        let dataSourceLength;

        if (rowCount || dataSource && dataSource.length) {
            dataSourceLength = rowCount || dataSource.length;
        }

        return (
            <div className="r-Pager">
                {numberOfPages === 1 ? null :
                    <Toolbar flex textCenter flush block noRadius className={props.className}>
                        <Button simple block size="small" disabled={currentPage === 0} tabIndex={-1} onClick={firstPage} icon="fast-backward"></Button>
                        <Button simple block size="small" disabled={currentPage === 0} tabIndex={-1} onClick={previousPage} icon="step-backward"></Button>
                        {this.renderPager(currentPage, numberOfPages, pagerSize ? pagerSize : 5)}
                        <Button simple block size="small" disabled={currentPage === numberOfPages - 1} tabIndex={-1} onClick={nextPage} icon="step-forward"></Button>
                        <Button simple block size="small" disabled={currentPage === numberOfPages - 1} tabIndex={-1} onClick={this.lastPage.bind(this, numberOfPages)} icon="fast-forward"></Button>
                        {hidePageSize ? null : <Dropdown simple block hideHeader hideDropdownHeader rowIsSelectable="single" onChange={this.onSelected.bind(this)} material size="small" title={"Page Size " + pageSize} pageSizerOptions={pageSizerOptions} dataSource={pageSizerOptions || ['5', '10', '15']} />}
                    </Toolbar>
                }
                {hidePageSize ? null : <Toolbar flush noRadius className={props.className}><Button simple size="small">{((currentPage + 1) * pageSize) - pageSize + 1 + ' - ' + (((currentPage + 1) * pageSize) > dataSourceLength ? dataSourceLength : (currentPage + 1) * pageSize) + '' + (' of ' + dataSourceLength + ' ' + props.title)}</Button></Toolbar>}
            </div>
        )

    }
}