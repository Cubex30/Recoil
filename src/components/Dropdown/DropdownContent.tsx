import * as React from 'react';
import * as classNames from 'classnames';
import * as ReactDOM from 'react-dom';

import SlideIn from '../SlideIn/SlideIn';

import Selectable from '../Selectable/Selectable';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Layer from '../Layer/Layer';
import Portal from '../Portal/Portal';
import DropdownWrapper from './DropdownWrapper';
import Toolbar from '../Toolbar/Toolbar';

import DropdownContentType from './DropdownContentType';
import DropdownHeader from './DropdownHeader';

import './Dropdown.less';

export default class DropdownContent extends React.Component<any, any>{
    render() {

        const self = this;
        const props = self.props;

        let {
            position,
            open,
            title,
            icon,
            onClose,
            type,
            children,
            // Table
            dataSource,
            focusOnMount,
            hideHeader,
            rowIsSelectable,
            selectedElements,
            selectedKey,
            pageSizerOptions,
            columns,
            onSort,
            sortable,
            hidePageSize,
            pageSize,
            rowCount,
            page,
            onPageChange,
            searchableKeys,
            searchTitle,
            contentMaxHeight,
            onRowSelect
            //
        } = props;

        let dropdownHeaderProps = {
            onClose,
            title,
            icon
        }

        let dropdownContentTypeProps = {
            type,
            children,
            // Table
            dataSource,
            focusOnMount,
            hideHeader,
            rowIsSelectable,
            selectedElements,
            selectedKey,
            pageSizerOptions,
            columns,
            onSort,
            sortable,
            hidePageSize,
            pageSize,
            rowCount,
            page,
            onPageChange,
            searchableKeys,
            searchTitle,
            contentMaxHeight,
            onRowSelect
            //
        }

        return (
            <div className="r-DropdownWrapper">
                <DropdownHeader {...dropdownHeaderProps} />
                <DropdownContentType {...dropdownContentTypeProps} />
            </div>
        )
    }
}