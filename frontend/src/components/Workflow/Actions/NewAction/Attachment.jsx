import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// =============== Our Styles ======================
import classes from "../../CreateWorkflow/css/Attachment.module.css";

// -------------------- MUI Components --------------------
import Button from '@mui/material/Button';
// ------------ Helper Functions -----------------
import { getProperThumbnail } from "../../utils/helpers";

const Attachment = ({ myFiles, setMyFiles }) => {
    // My States: 
    // const [myFiles, setMyFiles] = useState([]);
    // End My States ================

    useEffect(() => {
        // print the state `myFiles` whenever it is updated:
        // console.log(myFiles);
    }, [myFiles]);


    // ===== This is our implementation for the "onDrop" function: 👇
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        // acceptedFiles: array of accepted files (similar to event.target.files):
        acceptedFiles.forEach((file) => {
            // (file) is of type BLOB
            const reader = new FileReader(); // JavaScript built-in
            reader.onload = () => {
                // keep the previously stored files in the state,
                // and add to them the newly dropped ones.
                setMyFiles(prevState => [...prevState, { fileInfo: file, dataURL: reader.result }]);
            }
            /*
                - fileInfo: this is what I need to send to the server to store the file.
                    (fileInfo is the files in "multipart/formdata" format).
                - dataURL: only needed to let the browser read the file (e.g. image) as a Base64
                format, so that the browser can show us the image in case we uploaded an image.
            */

            reader.readAsDataURL(file);
            // multipart/formdata ==> Base64 format

            // first, the `file` will be read as DataURL (Base64 format), and once it is read, 
            // the ONLOAD event will be fired, and then we set the state `myFiles`
            // to store the newly read file as a DataURL format.
        });

        // console.log("acceptedFiles", acceptedFiles);
        // console.log("rejectedFiles", rejectedFiles);
    }, []);

    // =================== useDropzone ================================
    // useDropzone is a custom-hook imported from 'react-dropzone' library:
    // This custom hook returns 3 things:
    // 1. getRootProps, 2. getInputProps (These are functions)
    // 3. isDragActive: this is a boolean state:
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, //will be called only if the dropped file is accepted.
        // accept: 'image/jpeg, image/png, image/gif, application/pdf'
        // any other file type will be stored in the rejectedFiles
    });
    // =================== End useDropzone ================================


    const handleDelete = (e, indexToBeDeleted) => {
        e.preventDefault();
        setMyFiles(
            myFiles.filter((file, index) => index !== indexToBeDeleted)
        )
    }

    // console.log(getInputProps(), getRootProps());

    /*
      We don't need to specify the type='file' manually by ourselves
      because the getInput() props will return all these things:
          accept: undefined
          autoComplete: "off"
          multiple: true
          onChange: ƒ (event)
          onClick: ƒ (event)
          ref: {current: input}
          style: {display: 'none'}
          tabIndex: -1
          type: "file"
          [[Prototype]]: Object
    */

    /*
      The same for getRootProps():
            onBlur: ƒ (event)
            onClick: ƒ (event)
            onDragEnter: ƒ (event)
            onDragLeave: ƒ (event)
            onDragOver: ƒ (event)
            onDrop: ƒ (event)
            onFocus: ƒ (event)
            onKeyDown: ƒ (event)
            ref: {current: null}
            role: "button"
            tabIndex: 0
            [[Prototype]]: Object 
    */
    return (
        <div className={classes.attachment100}>
            <div className={classes.dropzone} {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? "Drag Active" : "Drop files here / Click to upload files"}
            </div>

            {
                // Preview Files before Upload
                myFiles.length > 0 &&
                <div className={classes.previewFiles}>
                    <h3 className={classes.h3}>Preview Files before Uploading:</h3>
                    {
                        myFiles.map((file, index) => {
                            return (
                                <div key={index} className={classes.filePreviewItem}>
                                    <img
                                        // src={file.dataURL}
                                        src={getProperThumbnail(file)}
                                        className={classes.fileThumbnail}
                                    />
                                    <span className={classes.span}>{file.fileInfo.name}</span>
                                    {/* <span>{file.fileInfo.type}</span> */}
                                    <span className={classes.span}>
                                        {((file.fileInfo.size) / 1024).toFixed(2)} KBytes
                                    </span>
                                    {/* <span>{getProperThumbnail(file.fileInfo.name)}</span> */}
                                    <Button
                                        variant="text"
                                        color="error"
                                        onClick={(event) => handleDelete(event, index)}
                                        className={classes.myBtnDelete}
                                    >Delete</Button>
                                </div>
                            )
                        })
                    }
                </div>
            }


            {/* {myFiles.length > 0 &&
                <button
                    className='btn btn-outline-primary mt-4'
                    onClick={handleUpload}
                >Submit Files</button>
            } */}
        </div>
    );
}


// const getProperThumbnail = (file) => {
//     console.log("FILE_INFO: ", file.fileInfo);
//     const images = ['png', 'jpg', 'jpeg', 'gif'];
//     const fileName = file.fileInfo.name;
//     const fileExtension = fileName.split('.')[1];

//     if (images.includes(fileExtension)) {
//         // then the file is an image, so return its dataURL to be shown on the browser
//         return file.dataURL
//     }
//     else if (['doc', 'docx'].includes(fileExtension)) {
//         return "https://cdn.iconscout.com/icon/free/png-256/doc-file-1934509-1634559.png"
//     }
//     else if (['pdf'].includes(fileExtension)) {
//         return "https://toppng.com/uploads/preview/pdf-icon-11549528510ilxx4eex38.png"
//     }
//     else if (['mp4'].includes(fileExtension)) {
//         return "https://esquilo.io/png/thumb/phK80cFlKWCzhap-Video-Icon-PNG-Free-Download.png"
//     }
//     return "https://icon-library.com/images/file-icon-image/file-icon-image-22.jpg";
// }

// const getProperThumbnail = (file) => {
//     console.log(file.fileInfo);
//     const mimeType = file.fileInfo.type;
//     const [type, subtype] = mimeType.split('/'); // ex: type: "application", subtype: "pdf"

//     const imageTypes = ['png', 'jpg', 'jpeg', 'gif'];
//     const videoTypes = ['mp4', 'webm', 'ogg', 'mpeg', 'mp2t', '3gpp', '3gpp2'];
//     const docTypes = ['msword', 'doc', 'docx', 'rtf', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];


//     if (imageTypes.includes(subtype)) {
//         // then the file is an image, so return its dataURL to be shown on the browser
//         return file.dataURL;
// }
//     else if (docTypes.includes(subtype)) {
//         return "https://i.imgur.com/3o1fJ7R.png";
//         // return "../../../../public/images/docImage.png";
//     }
//     else if (['pdf'].includes(subtype)) {
//         return "https://i.imgur.com/oRMlYfk.png";
//         // return "../../../../public/images/pdf.png";
//     }
//     else if (videoTypes.includes(subtype)) {
//         return "https://i.imgur.com/U4AzWU3.png";
//         // return "../../../../public/images/video.png"
//     }
//     else if (type === "text") {
//         // for ex: text/json, text/csv, text/css, text/javascript, text/html, ...
//         return "https://i.imgur.com/BtWCADl.png";
//         // return "../../../../public/images/textSlash.png"
//     }
//     return "https://i.imgur.com/mB2nYfw.png";
// }


export default Attachment