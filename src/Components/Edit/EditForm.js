import React, { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { Formik, Field } from 'formik'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Divider,
    FormHelperText,
    Grid,
    Paper,
    TextField,
    Typography,
    makeStyles,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel
} from '@material-ui/core'
import UserAutoComplete from '../Shared/UserAutoComplete/UserAutoComplete'
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import { collection,updateDoc,doc } from '@firebase/firestore'
import { db } from '../../lib/firebase'

const useStyles = makeStyles(() => ({
    root: {},
    footer:{
        display:"flex",
        flexDirection:"row",
    },
    stOpen:{
        color:"gray",
    },
    stProccess:{
        color:"blue",
    },
    stReview:{
        color:"blue",
    },
    stTesting:{
        color:"chocolate",
    },
    stReopened:{
        color:"gray",
    },
    stWaiting:{
        color:"orange",
    },
    stClosed:{
        color:"green",
    }
}))

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

const getStatusCls = status => {
    switch (status){
        case 0:
            return "stOpen"
        case 1:
            return "stProccess"
        case 2:
            return "stReview"
        case 3:
            return "stTesting"
        case 4:
            return "stReopened"
        case 5:
            return "stWaiting"
        case 6:
            return "stClosed"
        default:
            return "stOpened"
    }
}

const getNextStatus = status =>{
    switch (status){
        case 0:
            return 1
        case 1:
            return 2
        case 2:
            return 3
        case 3:
            return 6
        case 4:
            return 1
        case 5:
            return 1
        case 6:
            return 4
        default:
            return 0
    }
}

const EditForm = ({ className,users,currentUser,task, ...rest }) => {
    const classes = useStyles()
    const history = useHistory()

    const onCancelClick = e =>{
        history.push("/dashboard")
    }

    return (
        <Formik
            initialValues={{
                name: task.name,
                description: task.description,
                assigned_to: task.assigned_to ,
                due_date: new Date(task.due_date.toMillis()),
                priority:task.priority, // 0 minor, 1 major, 2 blocker
                status:task.status,
                submit: null,
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string()
                    .max(255)
                    .required(),
                description: Yup.string()
                    .max(400)
                    .required(), 
                assigned_to: Yup.array().of(Yup.string())
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    // NOTE: Make API request
                    const { name, description,due_date,assigned_to,priority,status } = values

                    await updateDoc(doc(db,"tasks",task.id) ,{
                        name,
                        description,
                        assigned_to,
                        due_date,
                        priority,
                        status,
                        updated_at:new Date(),
                    }) 

                    setStatus({ success: true })
                    setSubmitting(false)
                    history.push('/dashboard')
                } catch (err) {
                    console.error(err)
                    setStatus({ success: false })
                    setErrors({ submit: err.message })
                    setSubmitting(false)
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue, touched, values }) => (
                <form onSubmit={handleSubmit} className={classes.root} {...rest}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} lg={12}>
                            <Card>
                                <CardContent>
                                    <TextField
                                        error={Boolean(touched.name && errors.name)}
                                        fullWidth
                                        label="Название задачи"
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        variant="outlined"
                                    />
                                    <Box mt={3} mb={1}>
                                        <TextField
                                            error={Boolean(touched.description && errors.description)}
                                            fullWidth
                                            multiline={true}
                                            rows={4}
                                            label="Описание задачи"
                                            name="description"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.description}
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Box mt={3} mb={1}>
                                    <Typography>
                                        Дата выполнения и Статус
                                    </Typography>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container >
                                            <KeyboardDatePicker
                                                disableToolbar
                                                variant="inline"
                                                format="dd/MM/yyyy"
                                                // format="DD-MM-YYYY"
                                                margin="normal"
                                                id="date-picker-inline"
                                                label="Дата выполнения"
                                                value={values.due_date}
                                                name="due_date"
                                                minDate={new Date()}
                                                onChange={value => {
                                                    setFieldValue('due_date', value)
                                                }}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                            <Button onClick={e=>setFieldValue("status",getNextStatus(values.status))} className={classes[getStatusCls(values.status)]} style={{marginLeft:"auto",height:"32px",marginTop:"20px",border:"1px solid"}}>
                                                {getStatusLabel(values.status)}
                                            </Button>
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Box>
                                <Box mt={3} mb={1}>
                                <FormControl component="fieldset">
                                  <FormLabel component="legend">Приоритет</FormLabel>
                                    <RadioGroup 
                                    row
                                    aria-label="priority" 
                                    name="row-radio-buttons-group"
                                    value={values.priority}
                                    onChange={e=>setFieldValue("priority",Number.parseInt(e.target.value))}
                                    >
                                        <FormControlLabel value={0} control={<Radio />} label="Minor" />
                                        <FormControlLabel value={1} control={<Radio />} label="Major" />
                                        <FormControlLabel value={2} control={<Radio />} label="Blocker" />
                                    </RadioGroup>
                                </FormControl>
                                </Box>
                                    <Box mt={3} mb={1}>
                                    <Typography style={{marginBottom:"10px"}}>
                                        Выбор исполнителя
                                    </Typography>
                                        <UserAutoComplete setter={value=>setFieldValue("assigned_to",value)} def={task.assigned_to} options={users} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    {errors.submit && (
                        <Box mt={3}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}
                    <Box className={classes.footer} mt={2}>
                        <Button color="secondary" variant="contained" type="submit" disabled={isSubmitting}>
                            Редактировать задачу
                        </Button>
                        <Button onClick={onCancelClick} style={{marginLeft:"auto"}} color="secondary" variant="outlined" type="submit">
                            Отмена
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default EditForm;
