const mongoose = require ('mongoose');

mongoose.connect('mongodb://localhost')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Error connecting to MongoDB...',err));

const courseSchema = new mongoose.Schema({
    name  : { 
        type: String, 
        required: true,
        minlenght: 5,
        maxlength: 255,
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        //lowercase: true
        trim: true
    },
    author: String,
        tags: {
            type: Array,
            validate: {
            isAsync: true,
            validator: function(v, callback) {
                setTimeout(() => {
                    // Do some async work here
                    const result = v && v.length > 0;
                    callback(result);
                }, 1);
            },
            message: ' A course should have at least one tag'
        }
    },
    date  : { type: Date, default: Date.now},
    isPublished: Boolean,
    price : {
        type: Number,
        required: function () { return this.isPublished; },
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)
    }
});



const Course = mongoose.model('Course',courseSchema);

async function createCourse() {
    const course = new Course ({
        name : 'Angular Course',
        category: 'Web',
        author : 'HAN',
        tags : ['frontend'],
        isPublished : true,
        price: 15.8
    });

    try {
        const result = await course.save();
        console.log(result);
    }
    catch (ex) {
        for (field in ex.errors)
        console.log(ex.errors[field].message);
    }
}

async function getCourses() {
    const pageNumber = 2;
    const pageSize   = 10;

    const courses = await Course
       .find  ({ _id: '1675537393212' })    
    //    .skip  ((pageNumber - 1) * pageSize)
    //    .limit (pageSize)
       .sort  ({ name: 1 })
       .select({ name: 1, tags: 1, price : 1 });
    console.log(courses[0].price);
}

async function updateCourse(id) {
    try {
        const course = await Course.findByIdAndUpdate({ _id: id }, {
            $set: {
                isPublished: false,
                author: 'Jason'

            }
    }, { new: true });
    console.log(course);
}
catch (e) {
    if (e instanceof mongoose.CastError)
       console.error ('No course with given id was found.');
    else 
       console.error ('Somthing failed.');
  }   
}
async function removeCourse(id) {
    try {
        const result = await Course.deleteMany({ isPublished: false});

        console.log(result);
    }
    catch (e) {
        if (e instanceof mongoose.CastError)
          console.error('No course with the given id was found.');
        else
          console.error('Something failed.');  
    }
  }

  getCourses();


