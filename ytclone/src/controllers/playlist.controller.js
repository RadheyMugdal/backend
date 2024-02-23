import { Playlist } from "../models/playlist.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllPlaylistVideos = async (req, res) => {
    try {
        const videos = await Playlist.aggregate([
            {
                $lookup: {
                    from: 'videos', // Name of the collection to join with
                    localField: 'videos',
                    foreignField: '_id',
                    as: 'videos' // Name of the field to store the joined videos
                }
            },
            {
                $unwind: {
                    path: '$videos',
                    preserveNullAndEmptyArrays: true // Preserve documents even if there is no match
                }
            },
            {
                $project: {
                    'videos.title': 1,
                    'videos.description': 1,
                    'videos.videoFile': 1,
                    'videos.thumbnail': 1,
                    'videos.duration': 1,
                    'videos.views': 1,
                    'videos.owner': 1
                }
            }
        ]);

        res.status(200).json({ videos });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createPlaylist=asyncHandler(async (req,res)=>{
    const {name,description}=req.body;

    if(!name){
        throw new ApiError(400,"Please provide a name for the playlist");
    }
    if(!description){
        throw new ApiError(400,"Please provide a name for the playlist");
    }
    
    const playlist=await Playlist.create(
        {
            name,
            description,
            videos:[],
            owner: req.user?._id

        }

        )
        if(!playlist){
            throw new ApiError(500,'Something went wrong while creating the playlist')
        }

        return res 
        .status(200)
        .json(new ApiResponce(200,playlist,"Playlist created successfully"))

})

const getUserPlaylist=asyncHandler(async (req,res)=> {
    const {userId}=req.params
    if(!userId){
        throw new ApiError(400,"No userId provided")
    }
    const playlists = await Playlist.find({owner : userId })

    if (playlists.length === 0) {
        throw new ApiError(404, "No playlist found with this User Id");
    }
    return res
    .status(200)
    .json(new ApiResponce(200,playlists,"Got playlists successfully"))
})

const getPlaylistById=asyncHandler(async (req,res)=>{
    const {playlistId}=req.params
    if(!playlistId){
        throw new ApiError(400,"No playlist ID was provided")
    }

    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(500,"Something went wrong while getting playlist")
    }

    return res
    .status(200)
    .json(new ApiResponce(200,playlist, "Playlist gotten successfully"))
})

const addVideoToPlaylist=asyncHandler(async (req,res)=>{
    const {playlistId,videoId}=req.params
    if(!playlistId || !videoId){
        throw new ApiError(400,"PlaylistId and videoId is required")
    }

   

    const playlist=await Playlist.findById(playlistId)
    if(playlist?.owner.toString()!==req.user?._id){
        throw new ApiError(401,"You don't have permission to perform this action")
    }else{
        const playlist=await Playlist.findByIdAndUpdate(playlistId,{ $push: {videos: videoId} },{new: true});
        if(!playlist){
            throw new ApiError(500,"Something went wrong while adding video to playlist")
        }
    
        return res
        .status(200)
        .json(new ApiResponce(200,playlist, "Video added to the playlist successfully"))
    }

})

const removeVideoFromPlaylist=asyncHandler(async (req,res)=>{
    const {videoId,playlistId}=req.params;
    if(!videoId || !playlistId){
        throw new ApiError(400,"VideoId and PlaylistId is required")
    }

    const playlist=await Playlist.findById(playlistId)
    if(playlist?.owner.toString()!==req.user?._id){
        throw new ApiError(401,"You don't have permission to perform this action")
    }else{
    const playlist=await Playlist.findByIdAndUpdate(playlistId,{$pull:{videos:videoId}})

    if(!playlist){
        throw new ApiResponce(404,"The Video or Playlist not found in database")
    }
    return res
    .status(200)
    .json(new ApiResponce(200,playlist,"Video removed from the playlist successfully"));
}
})

export { addVideoToPlaylist, createPlaylist, getAllPlaylistVideos, getPlaylistById, getUserPlaylist, removeVideoFromPlaylist };
