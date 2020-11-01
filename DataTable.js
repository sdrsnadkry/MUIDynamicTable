import { Card, TextField } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import clsx from 'clsx';
import React, { useState } from 'react';


/***
 * STYLES FOR TABLE
 */

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    title: {
        flex: '1 1 100%',
    },
}));


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

/***
 * FOR SORTING TABLE
 */

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


/***
 * TABLE HEAD
 */

function DynamicTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, dynamicHeadCells } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all' }}
                        color="primary"
                    />
                </TableCell>
                {dynamicHeadCells.map((headCell, i) => (
                    <TableCell
                        key={headCell.id}
                        align={i !== 0 ? 'right' : 'left'} /***ALIGNS FIRST COLUMN TO LEFT AND OTHERS TO RIGHT */
                        padding={'default'} /***SETS ALL PADDINGS TO DEFAULT TABLE'S PADDING */
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell className="table_action" align="right">
                    Actions
                </TableCell>
            </TableRow>

        </TableHead>
    );
}


/***
 * TABLE TOOLBAR
 */

const DynamicTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const [searchValue, setSearchedValue] = useState('');
    const [warning, setWarning] = useState(false);
    const { numSelected, tableInfo } = props;

    // const dispatch = useDispatch();


    /***
     *FOR SWEET ALERT
     *  */
    function openConfirmAlert() {
        setWarning(true)
        console.log(props.selectedIds)
    }
    const onCancelDelete = () => {
        setWarning(false)
    }
    const onConfirmDelete = () => {
        // dispatch(actionDeleteDepartment(props.selectedIds))
        setWarning(false)


    }

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className="table__typography" color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected {props.isFetching && (<CircularProgress style={{ width: "20px", height: "20px", margin: "20px 0 0 15px" }} />)}
                </Typography>
            ) : (
                    <Typography className="table__typography" variant="h6" id="tableTitle" component="div">
                        {tableInfo.tableTitle} {props.isFetching && (<CircularProgress style={{ width: "20px", height: "20px", margin: "20px 0 0 15px" }} />)}
                    </Typography>
                )}

            {numSelected === 0 && (
                <Tooltip title="Filter list">
                    <TextField
                        placeholder="search"
                        value={searchValue}
                        onKeyUp={() => props.searchedValue(searchValue)}
                        onChange={(e) => setSearchedValue(e.target.value)}
                    />
                </Tooltip>
            )}
            {numSelected >= 1 && (

                <Tooltip title="Delete">
                    <IconButton aria-label="Delete" onClick={() => openConfirmAlert(true)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            )}

        </Toolbar>
    );
};


/***
 * MAIN TABLE CONTAINER
 */

export default function DynamicTable(props) {
    const classes = useStyles();
    // const dispatch = useDispatch();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('date');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [query, setQuery] = React.useState('');
    const [searchResults, setSearchResuts] = React.useState([]);

    const { tableInfo } = props

    /***
     * CREATES TABLE HEADS BASED ON FIELDS PASSED AS PROPS
    */
    const dynamicHeadCells = tableInfo.fields.map(x => ({
        id: x, label: x.replace(/^./, x[0].toUpperCase())
    }))


    /***
     * CREATES DATA AND STORES IN ROWS STATE ***** SHOULD SEND CORRECT DATA FROM PARENT COMPONENT
     */

    React.useEffect(() => {
        setRows(tableInfo.datas)
    }, [tableInfo.datas])



    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const isSelected = (name) => selected.indexOf(name) !== -1;


    const handleSearchedValue = (value) => {
        setQuery(value)

        const filteredData = rows?.filter((row) =>
            dynamicHeadCells.some(
                (columns) => row[columns.id].toString().toLowerCase().indexOf(value.toLowerCase()) > -1
            )
        );
        setSearchResuts(filteredData)
    }

    let datas = searchResults.length === 0 && !query ? rows : searchResults

    return (
        <Card className="mt__4 px-3 my-3">
            <div >
                <DynamicTableToolbar
                    numSelected={selected.length}
                    searchedValue={handleSearchedValue}
                    selectedIds={selected}
                    isFetching={props.isFetching}
                    tableInfo={tableInfo}
                />
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        aria-label="enhanced table"
                    >
                        <DynamicTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={datas?.length}
                            dynamicHeadCells={dynamicHeadCells}

                        />
                        <TableBody>
                            {
                                datas?.length < 1
                                    ? (
                                        <TableRow>
                                            <TableCell align="center" colSpan={7} >
                                                <Typography variant="h6">
                                                    {
                                                        props.isFetching ? "..." : 'No Datas Available'
                                                    }

                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    :
                                    <>
                                        {stableSort(datas, getComparator(order, orderBy))
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) => {
                                                const isItemSelected = isSelected(row.id);
                                                const labelId = `enhanced-table-checkbox-${index}`;

                                                return (
                                                    <TableRow
                                                        hover

                                                        role="checkbox"
                                                        aria-checked={isItemSelected}
                                                        tabIndex={-1}
                                                        key={row.id}
                                                        selected={isItemSelected}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={isItemSelected}
                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                                color="primary"
                                                                onClick={(event) => handleClick(event, row.id)}
                                                            />
                                                        </TableCell>
                                                        {
                                                            dynamicHeadCells.map((x, i) => (
                                                                <TableCell align={i === 0 ? "left" : "right"} key={x.id}>{row[x.id]}</TableCell>
                                                            ))
                                                        }

                                                        <TableCell align="right" className="databale__action">
                                                            <Tooltip title={`${row?.id} Details `}>
                                                                <VisibilityIcon style={{ color: "#000" }} />
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                    </>
                            }

                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>

        </Card>
    );
}