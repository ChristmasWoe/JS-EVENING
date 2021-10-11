import React,{useState} from "react";
import { Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Grid,
    TablePagination,
    Box,
    Card,
    Avatar,
    Tooltip
} from "@material-ui/core";
import PerfectScrollbar from 'react-perfect-scrollbar'
import moment from "moment"
import {
    ChevronsDown as MinorIcon,
    ChevronsUp as MajorIcon,
    Slash as BlockerIcon,
    ArrowUp as AscIcon,
    ArrowDown as DescIcon
} from 'react-feather'
import { Link as RouterLink } from 'react-router-dom'

function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */
    return color;
  }

function getInitialsFromName(fn){
    try{
        let arr = fn.split(" ");
        if (arr.length>1){
            return arr[0][0].toUpperCase() + arr[1][0].toUpperCase();
        }
        return arr[0][0].toUpperCase();
    }catch(e){
        return fn[0].toUpperCase()
    }
}


const applyPagination = (items, page, limit) => {
    return items.slice(page * limit, page * limit + limit)
}

const getStatusLabel = status => {
    switch (status){
        case 0:
            return "Открыто"
        case 1:
            return "В процессе"
        case 2:
            return "Код ревью"
        case 3:
            return "В тестировании"
        case 4:
            return "Переоткрыто"
        case 5:
            return "В ожидании"
        case 6:
            return "Закрыто"
        default:
            return "Открыто"
    }
}

const Assignees = ({assignees,users,...props}) => {
    const selected_users = users.filter(user=>assignees.includes(user.uid));
    return (
        <div style={{display:"flex",flexDirection:"row"}}>
        {selected_users.map(user=>(
            <Tooltip title={user.email}>
            <Avatar  
             key={"assignees-"+user.uid}
             style={{backgroundColor:stringToColor(user.email),cursor:"pointer",fontWeight:"400"}}
              >
                  {getInitialsFromName(user.name||user.email)}
            </Avatar>
            </Tooltip>
            ))}
        </div>
    )
} 

const filterItems = (items, filters) =>{
    let filterValues = Object.values(filters);
    let isFiltered = false;
    let result = [...items];
    for(let i =0; i<filterValues.length;i++){
        if(filterValues[i]!=""){
            isFiltered = true;
        }
    }
    if(!isFiltered){
        return items
    }

    if(filters.priority!=""){
        if(filters.priority=="asc"){
            result = result.sort((a, b) => parseFloat(a.priority) - parseFloat(b.priority));
        }else{
            result = result.sort((a, b) => parseFloat(b.priority) - parseFloat(a.priority));
        }
    }
    return result;
}

const ListView = ({tasks,users,...props}) => {
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    const [filterPriority,setFilterPriority] = useState("");
    const handlePageChange = (event, newPage) => {
        setPage(newPage)
    }

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value))
    }

    const onPriorityClick = e => {
        if(filterPriority==""){
            setFilterPriority("desc")
        }else if (filterPriority == "desc"){
            setFilterPriority("asc")
        }else{
            setFilterPriority("")
        }
    }

    const paginated = applyPagination(tasks,page,limit)
    const filtered = filterItems(paginated,{priority:filterPriority})

    return (
        <Card style={{width:"90%"}}>
            {/* <PerfectScrollbar> */}
                <Box minWidth={700}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Исполнитель</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell onClick={onPriorityClick} style={{cursor:"pointer"}}>
                                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                                    Приоритет
                                    {filterPriority=="asc"?
                                <AscIcon />
                                :
                                filterPriority=="desc"?
                                <DescIcon />
                                :
                                null    
                                }
                                    </div>
                                    </TableCell>
                                <TableCell>Дата выполнения</TableCell>
                                <TableCell>Дата создания</TableCell>
                                <TableCell>Статус</TableCell>
                                {/* <TableCell></TableCell> */}
                                {/* <TableCell>Orders</TableCell>
                                <TableCell>Spent</TableCell>
                                <TableCell align="right">Actions</TableCell> */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((item) => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell><Assignees assignees={item.assigned_to} users={users} /></TableCell>
                                        <TableCell style={{cursor:"pointer"}}><RouterLink style={{color:"black"}} to={`/dashboard/edit/${item.id}`}>{item.name}</RouterLink>  </TableCell>
                                        <TableCell>
                                            {item.priority==0?
                                            <Tooltip title="Minor">
                                            <MinorIcon />
                                            </Tooltip>
                                            :
                                            item.priority==1?
                                            <Tooltip title="Major">
                                            <MajorIcon />
                                            </Tooltip>
                                            :
                                            <Tooltip title="Blocker">
                                                <BlockerIcon /> 
                                            </Tooltip>   
                                        }
                                        </TableCell>
                                        <TableCell>{moment(new Date(item.due_date.toMillis())).format("MMMM Do YYYY")}</TableCell>
                                        <TableCell>{moment(new Date(item.created_at.toMillis())).format("MMMM Do YYYY")}</TableCell>
                                        <TableCell>{getStatusLabel(item.status)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Box>
            {/* </PerfectScrollbar> */}
            <TablePagination
                component="div"
                count={filtered.length}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[10, 25, 50]}
            />
        </Card>

    )
}

export default ListView;